/**
 * ============================================================================
 * ARCHIVO: Seguridad.gs (MIGRADO A SUPABASE)
 * RESPONSABILIDAD: Control de acceso, Audit Trail, Encriptación y Usuarios.
 * ============================================================================
 */

/**
 * 1. AUDIT TRAIL (NÚCLEO ALCOA+ EN SUPABASE)
 * Registra cada acción importante mediante POST a la base de datos.
 */
function registrarAuditTrail(usuario, modulo, accion, detalle) {
  try {
    const payload = {
      fecha: new Date().toISOString(),
      usuario: usuario,
      modulo: modulo,
      accion: accion,
      detalle: detalle
    };

    const response = postToSupabase('audit_trail', payload);
    if (!response || response.error) {
      console.error("Fallo al registrar Audit Trail en Supabase: " + (response ? response.message : "Sin respuesta"));
    }
  } catch (e) {
    console.error("Fallo crítico en Audit Trail: " + e.message);
  }
}

/**
 * 2. ENCRIPTACIÓN SHA-256
 */
function computeSHA256(input) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  let txtHash = "";
  for (let i = 0; i < rawHash.length; i++) {
    let hashVal = rawHash[i];
    if (hashVal < 0) hashVal += 256;
    if (hashVal.toString(16).length == 1) txtHash += "0";
    txtHash += hashVal.toString(16);
  }
  return txtHash;
}

/**
 * 3. GESTIÓN DE SESIÓN Y PERMISOS (CONSULTAS A SUPABASE)
 */
function verificarPermisoBackend(usuarioLogin, rolesPermitidos) {
  const usuarios = getFromSupabase('usuarios', `usuario=eq.${usuarioLogin}`);
  if (!usuarios || usuarios.length === 0) return false;

  const user = usuarios[0];
  if (user.estatus !== 'Activo') return false;
  if (rolesPermitidos.includes(user.rol) || rolesPermitidos.includes('Todos')) return true;

  return false;
}

function loginInterno(usuarioInput, passwordHashInput) {
  const usuarios = getFromSupabase('usuarios', `usuario=eq.${usuarioInput}`);
  if (!usuarios || usuarios.length === 0) {
    return { success: false, message: "Usuario no encontrado." };
  }

  const user = usuarios[0];
  if (user.estatus === 'Bloqueado') {
    return { success: false, message: "Bloqueado por QA." };
  }

  if (user.password_hash === passwordHashInput) {
    patchSupabase('usuarios', `id=eq.${user.id}`, { intentos: 0 });
    registrarAuditTrail(usuarioInput, 'Seguridad', 'Login', 'Ingreso exitoso.');

    return {
      success: true,
      nombre: user.nombre,
      rol: user.rol,
      usuario: user.usuario,
      area: user.area
    };
  } else {
    let intentos = (user.intentos || 0) + 1;
    let nuevoEstatus = user.estatus;

    if (intentos >= 3) {
      nuevoEstatus = 'Bloqueado';
      registrarAuditTrail('SISTEMA', 'Seguridad', 'Bloqueo Automático', `Usuario ${usuarioInput} bloqueado por seguridad.`);
    }

    patchSupabase('usuarios', `id=eq.${user.id}`, { intentos: intentos, estatus: nuevoEstatus });
    registrarAuditTrail(usuarioInput, 'Seguridad', 'Fallo de Login', `Intento ${intentos} de 3.`);

    return { success: false, message: `Error. Intento ${intentos} de 3.` };
  }
}

function registrarCierreSesion(usuario, motivo) {
  registrarAuditTrail(usuario, 'Seguridad', 'Logout', motivo);
  return { success: true };
}

/**
 * 4. OPERACIONES DE USUARIOS EN SUPABASE
 */
function obtenerUsuariosBD() {
  const usuarios = getFromSupabase('usuarios', 'order=id.asc');
  return usuarios || [];
}

function gestionarUsuario(datos) {
  try {
    const rolesAdmin = ['Administrador', 'Gerente', 'Jefe de Control de Calidad'];
    if (!verificarPermisoBackend(datos.autorizador, rolesAdmin)) {
      registrarAuditTrail(datos.autorizador, 'Seguridad', 'Violación de Acceso', `Intento de edición de usuario denegada.`);
      throw new Error("Bloqueo CFR 21: Tu rol no permite administrar usuarios.");
    }

    let idFinal = datos.id;
    let isNewUser = (!idFinal || idFinal === 'Autogenerado al guardar');
    let hashParaGuardar = '';
    let fechaPass = new Date().toISOString();

    if (isNewUser) {
      if (!datos.clavePlana || datos.clavePlana.trim() === '') {
        throw new Error("Usuario nuevo requiere clave temporal.");
      }
      hashParaGuardar = computeSHA256(datos.clavePlana.trim());

      // Autogenerar ID U-XXX
      const currentUsers = getFromSupabase('usuarios', 'select=id&order=id.desc&limit=1');
      let nextNum = 1;
      if (currentUsers && currentUsers.length > 0) {
        let lastId = String(currentUsers[0].id);
        if (lastId.startsWith('U-')) {
          nextNum = parseInt(lastId.replace('U-', ''), 10) + 1;
        }
      }
      idFinal = 'U-' + String(nextNum).padStart(3, '0');

      const payload = {
        id: idFinal,
        nombre: datos.nombre,
        rol: datos.rol,
        usuario: datos.usuario,
        password_hash: hashParaGuardar,
        estatus: datos.estatus,
        intentos: 0,
        fecha_pass: fechaPass,
        area: datos.area
      };

      postToSupabase('usuarios', payload);
      registrarAuditTrail(datos.autorizador, 'Configuración', 'Alta de Usuario', `ID: ${idFinal}`);

    } else {
      const payload = {
        nombre: datos.nombre,
        rol: datos.rol,
        usuario: datos.usuario,
        estatus: datos.estatus,
        area: datos.area
      };

      if (datos.clavePlana && datos.clavePlana.trim() !== '') {
        payload.password_hash = computeSHA256(datos.clavePlana.trim());
        payload.fecha_pass = fechaPass;
      }

      patchSupabase('usuarios', `id=eq.${idFinal}`, payload);
      registrarAuditTrail(datos.autorizador, 'Configuración', 'Actualización de Usuario', `ID: ${idFinal}`);
    }

    return { success: true, mensaje: `Usuario ${idFinal} guardado.` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function cambiarPasswordObligatorio(usuarioLogin, nuevoHash) {
  try {
    const payload = {
      password_hash: nuevoHash,
      fecha_pass: new Date().toISOString()
    };

    const response = patchSupabase('usuarios', `usuario=eq.${usuarioLogin}`, payload);

    if (response && !response.error) {
      registrarAuditTrail(usuarioLogin, 'Seguridad', 'Cambio de Contraseña', 'Actualización CFR 21.');
      return { success: true, mensaje: "Contraseña actualizada." };
    } else {
      return { success: false, error: "No se pudo actualizar el usuario en la base de datos." };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}