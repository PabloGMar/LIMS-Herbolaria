
    // ==========================================
    // ðŸŒ VARIABLES GLOBALES Y UTILIDADES
    // ==========================================
    let sessionUser = "", sessionRol = "", loteActualSlideOver = "", todasLasMuestras = [];
    let tabActiva = 'Cuarentena', miGraficoEstatus = null, miGraficoAnalistas = null;
    let inventarioReactivos = [], lotesReactivosDisponibles = [], arregloResultadosGlobal = [];
    let lotePendienteDictamen = "", estatusPendienteDictamen = "", tipoFirmaGlobal = "";
    let inventarioDataGlobal = { stock: [], preparaciones: [], cepas: [] };
    let tabInventarioActiva = 'STOCK', itemInventarioSeleccionado = { id: '', tipo: '', estatusActual: '' };
    let auditTrailDataGlobal = [], cepaSeleccionada = { atcc: '', idTubo: '', microorganismo: '', accion: '', loteProv: '' };

    async function hashPassword(p) { const m = new TextEncoder().encode(p), h = await crypto.subtle.digest('SHA-256', m); return Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join(''); }
    function setLoading(b, tId, lId, isL, txt) { const tE = document.getElementById(tId), lE = document.getElementById(lId); b.disabled = isL; isL ? b.classList.add('opacity-80', 'cursor-not-allowed') : b.classList.remove('opacity-80', 'cursor-not-allowed'); tE.textContent = txt; isL ? lE.classList.remove('hidden') : lE.classList.add('hidden'); }
    function mostrarError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
    function showToast(msg) { const c = document.getElementById('toastContainer'), t = document.createElement('div'); t.className = 'slide-up bg-white border border-slate-200 p-4 rounded-xl shadow-xl flex items-center gap-3 min-w-[300px] pointer-events-auto'; t.innerHTML = `<div class="text-sm">${msg}</div><button onclick="this.parentElement.remove()" class="ml-auto text-slate-400"><i class="fas fa-times"></i></button>`; c.appendChild(t); setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 300); }, 5000); }
    function formatearFecha(iso) { if (!iso) return ''; const f = new Date(iso); if (isNaN(f)) return iso; const m = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']; return `${f.getDate().toString().padStart(2, '0')}-${m[f.getMonth()]}-${f.getFullYear().toString().slice(-2)}`; }

    // ==========================================
    // â±ï¸ SESIÃ“N Y LOGIN
    // ==========================================
    let inactividadTimer; const T_MAX = 5 * 60 * 1000;
    function reiniciarTemporizador() { clearTimeout(inactividadTimer); if (sessionUser !== "") inactividadTimer = setTimeout(() => cerrarSesion(true), T_MAX); }
    window.onload = reiniciarTemporizador; document.onmousemove = reiniciarTemporizador; document.onkeypress = reiniciarTemporizador; document.onclick = reiniciarTemporizador; document.onscroll = reiniciarTemporizador;

    function cerrarSesion(motivo = "Cierre de sesiÃ³n manual") {
        // 1. EL PARCHE CRÃTICO: Matar cualquier panel o modal que estÃ© flotando
        if (typeof cerrarSlideOver === 'function') cerrarSlideOver();
        if (typeof cerrarModalFirma === 'function') cerrarModalFirma();

        // 2. Limpiar los modales generales por si acaso
        const modales = document.querySelectorAll('.modal-container, .slide-over');
        modales.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex'); // Por si forzamos el centrado antes
        });

        // Quitar el bloqueo de scroll del fondo
        document.body.style.overflow = 'auto';

        // 3. Registrar el cierre en el backend para el Audit Trail
        if (typeof sessionUser !== 'undefined' && sessionUser !== null) {
            google.script.run.registrarCierreSesion(sessionUser, motivo);
        }

        // 4. Limpiar variables de sesiÃ³n y seguridad del frontend
        sessionUser = null;
        sessionRol = null;
        arregloResultadosGlobal = []; // Borrar memoria de captura

        // 5. Ocultar el Dashboard y mostrar el Login
        const dashboard = document.getElementById('dashboardSection');
        const login = document.getElementById('loginSection');

        if (dashboard) dashboard.classList.add('hidden');
        if (login) login.classList.remove('hidden');

        // 6. Limpiar campos del login para que no se quede la contraseÃ±a
        if (document.getElementById('usuario')) document.getElementById('usuario').value = '';
        if (document.getElementById('password')) document.getElementById('password').value = '';
    }

    async function handleLogin(e) {
        e.preventDefault();

        // ðŸ’¡ SincronizaciÃ³n con Index.html
        const inputUser = document.getElementById('usuario');
        const inputPass = document.getElementById('password');
        const btn = document.getElementById('btnLogin');
        const errorDiv = document.getElementById('loginError');

        // ValidaciÃ³n de existencia por seguridad
        if (!inputUser || !inputPass) {
            console.error("Error: No se encontraron los campos de login en el HTML.");
            return;
        }

        const u = inputUser.value.trim();
        const pRaw = inputPass.value.trim();

        // UI: Cargando
        setLoading(btn, 'btnLoginText', 'btnLoginLoader', true, 'Verificando...');
        if (errorDiv) errorDiv.classList.add('hidden');

        // EncriptaciÃ³n
        const pHash = await hashPassword(pRaw);

        if (google) {
            google.script.run
                .withSuccessHandler(r => {
                    setLoading(btn, 'btnLoginText', 'btnLoginLoader', false, 'Ingresar');
                    if (r.success) {
                        sessionUser = r.usuario || u;
                        sessionRol = r.rol || 'Analista';

                        // LÃ³gica de cambio de contraseÃ±a temporal
                        if (pRaw.startsWith('Temp_')) {
                            document.getElementById('loginSection').classList.add('hidden');
                            document.getElementById('cambioPassSection').classList.remove('hidden');
                            window.tempUserSession = { nombre: r.nombre || u, rol: sessionRol };
                        } else {
                            mostrarDashboard(r.nombre || u, sessionRol);
                        }
                    } else {
                        mostrarError(errorDiv, r.message || "Credenciales incorrectas.");
                    }
                })
                .withFailureHandler(err => {
                    setLoading(btn, 'btnLoginText', 'btnLoginLoader', false, 'Ingresar');
                    mostrarError(errorDiv, "Error crÃ­tico de conexiÃ³n.");
                })
                .loginInterno(u, pHash);
        }
    }

    async function handleCambioPassword(e) { e.preventDefault(); const p1 = document.getElementById('newPassword1').value, p2 = document.getElementById('newPassword2').value, errDiv = document.getElementById('cambioPassError'); errDiv.classList.add('hidden'); if (p1 !== p2) return mostrarError(errDiv, "Las contraseÃ±as no coinciden."); if (p1.length < 8) return mostrarError(errDiv, "MÃ­nimo 8 caracteres."); if (p1.startsWith('Temp_')) return mostrarError(errDiv, "No usar 'Temp_'."); const btn = document.getElementById('btnCambiarPass'); setLoading(btn, 'btnCambiarPassText', 'btnCambiarPassLoader', true, 'Actualizando...'); const nHash = await hashPassword(p1); if (google) google.script.run.withSuccessHandler(r => { setLoading(btn, 'btnCambiarPassText', 'btnCambiarPassLoader', false, 'Guardar'); if (r.success) { document.getElementById('cambioPassSection').classList.add('hidden'); showToast('âœ… Actualizada.'); mostrarDashboard(window.tempUserSession.nombre, window.tempUserSession.rol); } else mostrarError(errDiv, r.error); }).cambiarPasswordObligatorio(sessionUser, nHash); }

    // ==========================================
    // ðŸ§­ NAVEGACIÃ“N
    // ==========================================
    function ocultarTodasLasVistas() { ['vistaMuestras', 'vistaUsuarios', 'vistaInventarios', 'vistaAuditTrail', 'vistaEquipos', 'vistaInteligencia'].forEach(v => document.getElementById(v).classList.add('hidden')); document.getElementById('textNavUsuarios').textContent = "Usuarios"; document.getElementById('textNavInventarios').textContent = "Inventarios"; document.getElementById('textNavAudit').textContent = "Audit Trail"; document.getElementById('textNavEquipos').textContent = "Equipos"; }

    function mostrarDashboard(nombre, rol) {
        // ðŸ’¡ SincronizaciÃ³n con tu Index.html
        const loginSec = document.getElementById('loginSection');
        const dashSec = document.getElementById('dashboardSection'); // Antes era mainContent
        const nameLabel = document.getElementById('welcomeUser');      // Antes era displayUserName
        const roleLabel = document.getElementById('userRoleBadge');    // Antes era displayUserRole

        // 1. Ocultar Login y mostrar Panel
        if (loginSec) loginSec.classList.add('hidden');

        if (dashSec) {
            dashSec.classList.remove('hidden');
        } else {
            console.error("Error: No se encontrÃ³ el ID 'dashboardSection' en el HTML.");
            Swal.fire('Error de Sistema', 'No se pudo cargar el panel principal.', 'error');
            return;
        }

        // 2. Actualizar etiquetas de usuario
        if (nameLabel) nameLabel.textContent = nombre;
        if (roleLabel) roleLabel.textContent = rol;

        showToast(`Bienvenido/a, ${nombre}`);

        // 3. Cargar datos iniciales
        if (typeof cargarMuestras === "function") {
            cargarMuestras();
        }
    }

    function tglVis(idVista, btnId, txtOrig) { const v = document.getElementById(idVista); if (v.classList.contains('hidden')) { ocultarTodasLasVistas(); v.classList.remove('hidden'); if (btnId) document.getElementById(btnId).textContent = "Volver a Muestras"; return true; } else { ocultarTodasLasVistas(); document.getElementById('vistaMuestras').classList.remove('hidden'); return false; } }
    function toggleVistaUsuarios() { if (tglVis('vistaUsuarios', 'textNavUsuarios')) cargarUsuarios(); }
    function toggleVistaInventarios() { if (tglVis('vistaInventarios', 'textNavInventarios')) cargarInventariosCompletos(); }
    function toggleVistaAuditTrail() { if (tglVis('vistaAuditTrail', 'textNavAudit')) cargarAuditTrail(); }
    function toggleVistaEquipos() { if (tglVis('vistaEquipos', 'textNavEquipos')) cargarEquipos(); }
    function toggleVistaInteligencia() { if (tglVis('vistaInteligencia', null)) initVistaInteligencia(); }

    // ==========================================
    // ðŸ“‹ MUESTRAS, RESULTADOS Y COA
    // ==========================================
    function cargarMuestras() { const tb = document.getElementById('tablaMuestrasBody'); tb.innerHTML = `<tr><td colspan="7" class="text-center py-10"><div class="loader inline-block rounded-full border-t-blue-600 h-6 w-6"></div></td></tr>`; if (google) google.script.run.withSuccessHandler(d => { todasLasMuestras = d || []; let cC = 0, cA = 0, cAp = 0, cL = 0, cR = 0; todasLasMuestras.forEach(i => { if (i.estatus === 'Cuarentena') cC++; else if (i.estatus === 'En AnÃ¡lisis') cA++; else if (i.estatus === 'Aprobado') cAp++; else if (i.estatus === 'Liberado') cL++; else cR++; }); document.getElementById('kpiCuarentena').textContent = cC; document.getElementById('kpiAnalisis').textContent = cA; document.getElementById('kpiAprobados').textContent = cAp; document.getElementById('kpiLiberados').textContent = cL; document.getElementById('kpiRechazados').textContent = cR; document.getElementById('actionBarTanda').classList.add('hidden'); renderTablaFiltrada(); }).obtenerMuestrasDashboard(); }

    function cambiarTab(e) { tabActiva = e; document.getElementById('buscadorTabla').value = ''; document.querySelectorAll('.kpi-card').forEach(k => k.classList.remove('ring-2', 'ring-offset-2', 'bg-amber-50/30', 'bg-blue-50/30', 'bg-purple-50/30', 'bg-emerald-50/30', 'bg-red-50/30')); const ka = document.getElementById(`kpi-${e}`); if (ka) { ka.classList.add('ring-2', 'ring-offset-2'); if (e === 'Cuarentena') ka.classList.add('bg-amber-50/30'); else if (e === 'En AnÃ¡lisis') ka.classList.add('bg-blue-50/30'); else if (e === 'Aprobado') ka.classList.add('bg-purple-50/30'); else if (e === 'Liberado') ka.classList.add('bg-emerald-50/30'); else ka.classList.add('bg-red-50/30'); } document.getElementById('tituloTablaActiva').textContent = `Mostrando: ${e}`; document.getElementById('actionBarTanda').classList.add('hidden'); renderTablaFiltrada(); }

    function renderTablaFiltrada() {
        const th = document.getElementById('tablaMuestrasHead'), tb = document.getElementById('tablaMuestrasBody'), term = document.getElementById('buscadorTabla').value.toLowerCase().trim();
        let mF = todasLasMuestras.filter(i => i.estatus === tabActiva && (!term || i.loteInterno.toLowerCase().includes(term) || i.producto.toLowerCase().includes(term)));
        mF = mF.slice().reverse().slice(0, 50); const esJefe = ['Jefe de Control de Calidad', 'Responsable Sanitario', 'Administrador'].includes(sessionRol);
        let thH = `<tr class="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">`;
        if (tabActiva === 'Cuarentena' || tabActiva === 'Liberado' || (tabActiva === 'Aprobado' && esJefe)) thH += `<th class="px-6 py-4 w-10 text-center rounded-tl-lg"><input type="checkbox" onclick="toggleAllTanda(this)" class="w-4 h-4 text-blue-600 rounded cursor-pointer border-slate-300"></th>`;
        thH += `<th class="px-6 py-4 font-bold">Lote</th><th class="px-6 py-4 font-bold">Producto</th><th class="px-6 py-4 font-bold">Prov</th><th class="px-6 py-4 font-bold">Fecha</th><th class="px-6 py-4 font-bold text-center">Estatus</th><th class="px-6 py-4 font-bold text-center rounded-tr-lg">AcciÃ³n</th></tr>`; th.innerHTML = thH;
        if (mF.length === 0) { tb.innerHTML = `<tr><td colspan="7" class="text-center py-16 text-slate-400"><i class="fas fa-folder-open text-5xl mb-4 block text-slate-300"></i><p class="font-medium text-lg">No se encontraron resultados</p></td></tr>`; return; }
        let h = ''; mF.forEach(i => {
            let b = '', bdg = '';
            if (tabActiva === 'Cuarentena') { b = `<button onclick="accionRapidaIniciarAnalisis('${i.loteInterno}')" class="flex items-center justify-center gap-2 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-amber-200 shadow-sm w-full transition-all"><i class="fas fa-play"></i> Iniciar</button>`; bdg = `<span class="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">Pendiente</span>`; }
            else if (tabActiva === 'En AnÃ¡lisis') { b = `<button onclick="abrirPlanAnalitico('${i.producto}', '${i.loteInterno}', '${i.tipoAnalisis}')" class="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-blue-200 shadow-sm w-full transition-all"><i class="fas fa-edit"></i> Capturar</button>`; bdg = `<span class="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">En Proceso</span>`; }
            else if (tabActiva === 'Aprobado') { b = `<span class="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block text-center"><i class="fas fa-clock mr-1"></i>Firma pdte.</span>`; bdg = `<span class="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">RevisiÃ³n</span>`; }
            else if (tabActiva === 'Rechazado') { b = `<button onclick="verCertificado('${i.loteInterno}')" class="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-300 shadow-sm w-full transition-all"><i class="fas fa-file-pdf"></i> CoA</button>`; bdg = `<span class="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">OOS</span>`; }
            else { b = `<button onclick="verCertificado('${i.loteInterno}')" class="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-300 shadow-sm w-full transition-all"><i class="fas fa-file-pdf"></i> CoA</button>`; bdg = `<span class="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm">Liberado</span>`; }
            h += `<tr class="hover:bg-blue-50 transition-colors border-b border-slate-100">`; if (tabActiva === 'Cuarentena' || tabActiva === 'Liberado' || (tabActiva === 'Aprobado' && esJefe)) h += `<td class="px-6 py-5 text-center"><input type="checkbox" value="${i.loteInterno}" onchange="toggleCheckboxTanda()" class="tanda-chk w-4 h-4 text-blue-600 rounded cursor-pointer border-slate-300"></td>`; h += `<td class="px-6 py-5 font-bold text-slate-800 text-sm">${i.loteInterno}</td><td class="px-6 py-5 text-slate-600 font-medium text-sm">${i.producto}</td><td class="px-6 py-5"><span class="bg-white text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">${i.loteProveedor || '-'}</span></td><td class="px-6 py-5 text-slate-500 text-sm">${formatearFecha(i.fechaIngreso)}</td><td class="px-6 py-5 text-center">${bdg}</td><td class="px-6 py-5 text-center w-36">${b}</td></tr>`;
        }); tb.innerHTML = h;
    }

    function toggleCheckboxTanda() { const chk = Array.from(document.querySelectorAll('.tanda-chk')).filter(c => c.checked), ab = document.getElementById('actionBarTanda'), btn = document.getElementById('btnIniciarMasivo'), txt = document.getElementById('btnIniciarMasivoText'); if (chk.length > 0) { ab.classList.remove('hidden'); document.getElementById('countTanda').textContent = chk.length; if (tabActiva === 'Cuarentena') { txt.textContent = "Iniciar AnÃ¡lisis"; btn.onclick = iniciarAnalisisSeleccionados; btn.className = "bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center shadow-sm"; } else if (tabActiva === 'Liberado') { txt.textContent = "Descargar PDF"; btn.onclick = descargarCoAsMasivo; btn.className = "bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center shadow-sm"; } else if (tabActiva === 'Aprobado') { txt.textContent = "Firmar y Liberar"; btn.onclick = () => solicitarFirmaParaDictamen("MASIVO", "Liberado"); btn.className = "bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center shadow-sm"; } } else ab.classList.add('hidden'); }
    function toggleAllTanda(s) { document.querySelectorAll('.tanda-chk').forEach(c => c.checked = s.checked); toggleCheckboxTanda(); }
    function iniciarAnalisisSeleccionados() { const l = Array.from(document.querySelectorAll('.tanda-chk')).filter(c => c.checked).map(c => c.value); if (l.length === 0) return; const btn = document.getElementById('btnIniciarMasivo'); setLoading(btn, 'btnIniciarMasivoText', 'btnIniciarMasivoLoader', true, 'Iniciando...'); if (google) google.script.run.withSuccessHandler(r => { setLoading(btn, 'btnIniciarMasivoText', 'btnIniciarMasivoLoader', false, 'Iniciar'); if (r.success) { showToast("âœ… Iniciado"); cargarMuestras(); } else showToast("âŒ Error"); }).iniciarAnalisisMasivo(l, sessionUser); }
    function accionRapidaIniciarAnalisis(l) { if (google && l) { showToast("â³ Iniciando..."); google.script.run.withSuccessHandler(r => { if (r.success) cargarMuestras(); }).cambiarEstatusMuestra(String(l).trim(), 'En AnÃ¡lisis', sessionUser); } }
    function toggleEstabilidad() { document.getElementById('divCodEstabilidad').classList.toggle('hidden'); }
    function openModal() {
        document.getElementById('formMuestra').reset();
        document.getElementById('modalOverlay').classList.remove('hidden');

        // ðŸ’¡ NUEVO: Cargar los productos dinÃ¡micamente desde Supabase
        if (google) {
            google.script.run.withSuccessHandler(productos => {
                const datalist = document.getElementById('listaProductos');
                datalist.innerHTML = ''; // Limpiar lista anterior
                if (productos && productos.length > 0) {
                    productos.forEach(prod => {
                        const opt = document.createElement('option');
                        opt.value = prod;
                        datalist.appendChild(opt);
                    });
                }
            }).obtenerListaProductos();
        }
    }
    function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }
    function handleRegistroMuestra(e) { e.preventDefault(); if (google) google.script.run.withSuccessHandler(r => { if (r.success) { closeModal(); cargarMuestras(); showToast("âœ… Muestra Registrada"); } }).ingresarMuestra(document.getElementById('producto').value, document.getElementById('loteInterno').value, document.getElementById('loteProv').value, document.getElementById('cantidad').value, sessionUser, document.getElementById('esEstabilidad').checked, document.getElementById('codEstabilidad').value, document.getElementById('numAnalisis').value); }

    function abrirPlanAnalitico(prod, lote, tipo = 'Rutina') { loteActualSlideOver = lote; document.getElementById('slideOverProducto').textContent = prod; document.getElementById('slideOverLote').innerHTML = `Lote: ${lote}`; document.getElementById('planAnaliticoLoader').classList.remove('hidden'); document.getElementById('planAnaliticoContent').innerHTML = ''; document.getElementById('dictamenFinal').value = ""; document.getElementById('slideOverOverlay').classList.remove('hidden'); setTimeout(() => { document.getElementById('slideOverOverlay').classList.remove('opacity-0'); document.getElementById('slideOverPanel').classList.remove('translate-x-full'); }, 10); document.body.style.overflow = 'hidden'; if (google) google.script.run.withSuccessHandler(rL => { lotesReactivosDisponibles = rL || []; google.script.run.withSuccessHandler(r => { if (r.success) renderPlanAnalitico(r.planDeAnalisis); }).obtenerPlanDeAnalisisPT(prod, tipo, lote); }).obtenerLotesReactivosDisponibles(); }
    function cerrarSlideOver() { document.getElementById('slideOverOverlay').classList.add('opacity-0'); document.getElementById('slideOverPanel').classList.add('translate-x-full'); setTimeout(() => document.getElementById('slideOverOverlay').classList.add('hidden'), 300); document.body.style.overflow = 'auto'; }

    function renderPlanAnalitico(d) {
        document.getElementById('planAnaliticoLoader').classList.add('hidden'); const c = document.getElementById('planAnaliticoContent'); if (!d) return; let h = '';
        d.forEach((i, idx) => {
            let p = i.prueba.toLowerCase(), l = i.limite.toLowerCase(), tE = 'numerica', rO = i.valorPrevio ? 'readonly' : '', cI = i.valorPrevio ? 'bg-slate-100 text-slate-500' : 'bg-white';
            if (l.includes('unidades') || l.includes('desvÃ­a')) tE = 'compleja'; else if (p.includes('aspecto') || !/\d/.test(i.limite)) tE = 'cualitativa';
            let iH = '';
            if (tE === 'compleja') iH = `<div class="flex-1"><select ${i.valorPrevio ? 'disabled' : ''} class="w-full px-3 h-[42px] rounded-lg border text-sm" onchange="manejarCompleja(this)"><option value="">Sel...</option><option value="Cumple con la prueba">Cumple</option><option value="No cumple">No Cumple</option></select><input type="hidden" class="resultado-input" data-prueba="${i.prueba}" data-especificacion="${i.limite}" value="${i.valorPrevio || ''}"></div>`;
            else if (tE === 'cualitativa') iH = `<div class="flex-1 flex flex-col gap-2"><select ${i.valorPrevio ? 'disabled' : ''} class="w-full px-3 h-[42px] rounded-lg border text-sm" onchange="manejarCualitativa(this)"><option value="">Sel...</option><option value="${i.limite}">${i.limite}</option><option value="Otro">Otro</option></select><input type="text" ${rO} class="resultado-input hidden w-full px-3 py-2 rounded-lg border text-sm" data-prueba="${i.prueba}" data-especificacion="${i.limite}" value="${i.valorPrevio || ''}"></div>`;
            else iH = `<input type="text" ${rO} class="resultado-input flex-1 px-3 h-[42px] rounded-lg border ${cI} text-sm" data-prueba="${i.prueba}" data-especificacion="${i.limite}" data-tipo="numerica" oninput="autoEvaluar(this)" value="${i.valorPrevio || ''}">`;
            h += `<div class="tarjeta-prueba border border-slate-200 rounded-xl p-5 mb-4 shadow-sm bg-white relative"><div class="barra-estado absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div><h4 class="font-bold pl-2 text-sm">${i.prueba}</h4><div class="pl-2 mt-2"><span class="text-xs text-slate-500">LÃ­mite: ${i.limite}</span><div class="flex gap-2 mt-2">${iH}<select disabled class="evaluacion-select w-24 h-[42px] px-2 rounded-lg border text-xs"><option value="">--</option><option value="Cumple">Cumple</option><option value="OOS">OOS</option></select></div><select class="lote-reactivo-select w-full mt-2 text-xs p-2 border rounded"><option value="">-- Reactivo --</option>${lotesReactivosDisponibles.map(x => `<option value="${x}">${x}</option>`).join('')}</select></div></div>`;
        }); c.innerHTML = h;
    }

    function autoEvaluar(el) {
        const spec = el.getAttribute('data-especificacion');
        const val = el.value.replace(/,/g, '').trim();
        const sel = el.closest('.tarjeta-prueba').querySelector('.evaluacion-select');

        if (!val) { sel.value = ''; verificarOOS(); return; }

        let vText = val.replace(/[<>â‰¤â‰¥=]/g, '').trim();
        let v = parseFloat(vText);
        if (isNaN(v)) { sel.value = 'OOS'; verificarOOS(); return; }

        // ðŸ’¡ EL TRUCO: Decodificar entidades HTML y quitar comas antes de leer el nÃºmero
        let specClean = spec.toLowerCase()
            .replace(/&le;|&#8804;/g, 'â‰¤')
            .replace(/&ge;|&#8805;/g, 'â‰¥')
            .replace(/&lt;|&#60;/g, '<')
            .replace(/&gt;|&#62;/g, '>')
            .replace(/,/g, '');

        // Buscadores de lÃ­mites matemÃ¡ticos
        let matchRango = specClean.match(/([0-9.]+)\s*[-â€“â€”]\s*([0-9.]+)/);
        let matchMenor = specClean.match(/(?:[<â‰¤]|max|mÃ¡x|menor|no m[aÃ¡]s).*?([0-9.]+)/);
        let matchMayor = specClean.match(/(?:[>â‰¥]|min|mÃ­n|mayor|no menos).*?([0-9.]+)/);
        let matchExacto = specClean.match(/([0-9.]+)/);

        if (matchRango) {
            sel.value = (v >= parseFloat(matchRango[1]) && v <= parseFloat(matchRango[2])) ? 'Cumple' : 'OOS';
        } else if (matchMenor) {
            sel.value = (v <= parseFloat(matchMenor[1])) ? 'Cumple' : 'OOS';
        } else if (matchMayor) {
            sel.value = (v >= parseFloat(matchMayor[1])) ? 'Cumple' : 'OOS';
        } else if (matchExacto) {
            sel.value = (v === parseFloat(matchExacto[1])) ? 'Cumple' : 'OOS';
        } else {
            sel.value = 'OOS';
        }

        verificarOOS();
    }
    function manejarCualitativa(s) { const h = s.nextElementSibling, es = s.closest('.tarjeta-prueba').querySelector('.evaluacion-select'); if (s.value === 'Otro') { h.classList.remove('hidden'); h.type = 'text'; h.value = ''; es.value = 'OOS'; } else { h.classList.add('hidden'); h.value = s.value; es.value = 'Cumple'; } verificarOOS(); }
    function manejarCompleja(s) { s.nextElementSibling.value = s.value; s.closest('.tarjeta-prueba').querySelector('.evaluacion-select').value = s.value.includes('No') ? 'OOS' : 'Cumple'; verificarOOS(); }

    function verificarOOS() {
        const dictamenSelect = document.getElementById('dictamenFinal'), opcionAprobado = dictamenSelect.querySelector('option[value="Aprobado"]'); let hayOOS = false;
        document.querySelectorAll('.evaluacion-select').forEach(sel => { const tarjeta = sel.closest('.tarjeta-prueba'); if (sel.value === 'OOS') { hayOOS = true; tarjeta.classList.add('border-red-400', 'bg-red-50'); } else { tarjeta.classList.remove('border-red-400', 'bg-red-50'); } });
        if (hayOOS && opcionAprobado) { opcionAprobado.disabled = true; if (dictamenSelect.value === 'Aprobado') dictamenSelect.value = ''; } else if (opcionAprobado) { opcionAprobado.disabled = false; } actualizarColorSelect(dictamenSelect);
    }
    function actualizarColorSelect(s) { if (!s) return; s.classList.remove('text-emerald-700', 'text-red-600', 'text-purple-600', 'text-slate-700', 'bg-purple-50', 'bg-red-50'); if (s.value === 'Aprobado') s.classList.add('text-purple-600', 'bg-purple-50'); else if (s.value === 'Rechazado') s.classList.add('text-red-600', 'bg-red-50'); else s.classList.add('text-slate-700'); }

    // ==========================================
    // ðŸ–‹ï¸ FIRMAS ELECTRÃ“NICAS Y COA
    // ==========================================
    function prepararFirmaAvance() { arregloResultadosGlobal = []; document.querySelectorAll('.resultado-input').forEach((inp, i) => { if (inp.value.trim() !== '' && !inp.hasAttribute('readonly')) arregloResultadosGlobal.push({ prueba: inp.getAttribute('data-prueba'), especificacion: inp.getAttribute('data-especificacion'), resultado: inp.value, evaluacion: document.querySelectorAll('.evaluacion-select')[i].value, loteReactivo: document.querySelectorAll('.lote-reactivo-select')[i].value }); }); if (arregloResultadosGlobal.length === 0) return showToast("âš ï¸ Nada que guardar."); tipoFirmaGlobal = 'AVANCE'; solicitarFirmaParaDictamen(loteActualSlideOver, 'En AnÃ¡lisis'); }
    function prepararDictamen() { arregloResultadosGlobal = []; let err = false; document.querySelectorAll('.resultado-input').forEach((inp, i) => { if (!inp.value) err = true; arregloResultadosGlobal.push({ prueba: inp.getAttribute('data-prueba'), especificacion: inp.getAttribute('data-especificacion'), resultado: inp.value || 'NR', evaluacion: document.querySelectorAll('.evaluacion-select')[i].value || 'OOS', loteReactivo: document.querySelectorAll('.lote-reactivo-select')[i].value }); }); const d = document.getElementById('dictamenFinal').value; if (!d) return showToast("âš ï¸ Elija dictamen."); if (d === 'Aprobado' && err) return showToast("âŒ Faltan resultados."); tipoFirmaGlobal = 'DICTAMEN'; solicitarFirmaParaDictamen(loteActualSlideOver, d); }
    function solicitarFirmaParaDictamen(lote, estatus) {
        lotePendienteDictamen = lote;
        estatusPendienteDictamen = estatus;
        document.getElementById('inputFirmaPassword').value = '';
        document.getElementById('errorFirma').classList.add('hidden');

        // Agregamos 'flex' para forzar el centrado perfecto
        const modal = document.getElementById('modalFirmaElectronica');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function cerrarModalFirma() {
        const modal = document.getElementById('modalFirmaElectronica');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }

    function ejecutarFirmaDictamen() {
        const p = document.getElementById('inputFirmaPassword').value;
        if (!p) return document.getElementById('errorFirma').classList.remove('hidden');

        const b = document.querySelector('#modalFirmaElectronica button.bg-indigo-600'), orig = b.innerHTML;
        b.innerHTML = 'Firmando...'; b.disabled = true;

        // 1. FIRMA PARA INVENTARIOS
        if (tipoFirmaGlobal === 'INVENTARIO' || tipoFirmaGlobal === 'INVENTARIO_MASIVO') {
            google.script.run.withSuccessHandler(r => {
                b.innerHTML = orig; b.disabled = false;
                if (r.success) {
                    cerrarModalFirma();
                    cargarInventariosCompletos();
                    // AdiÃ³s al "Triste Ok" -> Hola SweetAlert
                    Swal.fire({
                        title: 'Â¡Firma Aplicada!',
                        text: r.mensaje,
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                        timer: 3000
                    });
                } else mostrarError(document.getElementById('errorFirma'), r.error);
            }).actualizarEstatusInventarioMasivoConFirma(itemInventarioSeleccionado.id, itemInventarioSeleccionado.tipo, document.getElementById('selectNuevoEstatusInv').value, document.getElementById('inputJustificacionInv').value, sessionUser, p);
            return;
        }

        // 2. FIRMA PARA LIBERACIÃ“N MASIVA DE MUESTRAS
        if (lotePendienteDictamen === 'MASIVO') {
            google.script.run.withSuccessHandler(r => {
                b.innerHTML = orig; b.disabled = false;
                if (r.success) {
                    cerrarModalFirma();
                    cargarMuestras();
                    Swal.fire({
                        title: 'Â¡LiberaciÃ³n Exitosa!',
                        text: r.mensaje,
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                        timer: 3000
                    });
                }
            }).liberarMasivoConFirma(Array.from(document.querySelectorAll('.tanda-chk')).filter(c => c.checked).map(c => c.value), sessionUser, p);
            return;
        }

        // 3. FIRMA PARA DICTAMEN INDIVIDUAL DE MUESTRA
        google.script.run.withSuccessHandler(rf => {
            if (rf.success) {
                google.script.run.withSuccessHandler(rr => {
                    b.innerHTML = orig; b.disabled = false;
                    if (rr.success) {
                        cerrarModalFirma();
                        cerrarSlideOver();
                        cargarMuestras();
                        Swal.fire({
                            title: 'Â¡Resultados Guardados!',
                            text: 'Dictamen y resultados aplicados bajo normativa CFR 21.',
                            icon: 'success',
                            confirmButtonColor: '#10b981',
                            timer: 3000
                        });
                    }
                }).guardarResultadosYDictamen(lotePendienteDictamen, arregloResultadosGlobal, estatusPendienteDictamen, sessionUser);
            } else {
                b.innerHTML = orig; b.disabled = false;
                mostrarError(document.getElementById('errorFirma'), rf.error);
            }
        }).dictaminarMuestraConFirma(lotePendienteDictamen, estatusPendienteDictamen, sessionUser, p);
    }

    function verCertificado(lote) { if (google) { showToast("â³ Generando CoA..."); google.script.run.withSuccessHandler(renderizarCertificado).obtenerDatosCertificado(String(lote).trim()); } }
    function formatearResultado(r, e) { if (!/^\d/.test(r) && !/^[<>]/.test(r)) return r; let match = r.match(/^([<>]?\s*)([0-9.,]+)(.*)$/); if (!match) return r; let numStr = match[2].replace(/,/g, ''); let formateado = Number(numStr).toLocaleString('en-US', numStr.includes('.') ? { minimumFractionDigits: numStr.split('.')[1].length } : {}); let suf = match[3].trim(); if (suf === '') { let sm = e.match(/[0-9.,]+\s*([a-zA-Z%/]+.*)$/); if (sm && sm[1]) suf = ' ' + sm[1].trim(); } else suf = ' ' + suf; return match[1] + formateado + suf; }
    function renderizarCertificado(res) {
        if (!res.success) return alert(res.error); const m = res.muestra; document.getElementById('coaTipoCertificado').textContent = m.tipoAnalisis === 'Estabilidad' ? 'ESTABILIDAD' : 'PRODUCTO TERMINADO';
        document.getElementById('coaProducto').textContent = m.producto; document.getElementById('coaLote').textContent = m.loteInterno; document.getElementById('coaPresentacion').textContent = m.presentacion; document.getElementById('coaFechaMuestreo').textContent = formatearFecha(m.fechaIngreso); document.getElementById('coaFechaAnalisis').textContent = formatearFecha(res.fechaAnalisis); document.getElementById('coaNumAnalisis').textContent = m.numAnalisis; document.getElementById('coaTextoProd').textContent = m.producto; document.getElementById('coaDictamen').textContent = m.estatus === 'Liberado' ? 'Aprobado' : 'Rechazado';
        let fqA = '', mbA = '', ht = '';
        res.resultados.forEach(r => { let p = r.prueba.toLowerCase(); if (p.includes('bacteria') || p.includes('hongo') || p.includes('coli') || p.includes('salmonella') || p.includes('enterob') || p.includes('aerobi') || p.includes('microbio')) { if (r.analista) mbA = r.analista; } else { if (r.analista) fqA = r.analista; } ht += `<tr><td class="border px-2 py-1">${r.prueba}</td><td class="border px-2 py-1">${r.especificacion}</td><td class="border px-2 py-1 ${r.evaluacion === 'OOS' ? 'bg-gray-200 font-bold' : ''}">${formatearResultado(r.resultado, r.especificacion)}</td></tr>`; });
        document.getElementById('coaTablaResultados').innerHTML = ht; document.getElementById('coaFirmaFQ').textContent = m.analistaFQ || fqA || 'N/A'; document.getElementById('coaFirmaMB').textContent = m.analistaMB || mbA || 'N/A'; document.getElementById('coaFirmaJefe').textContent = res.jefe; document.getElementById('coaFirmaRS').textContent = res.rs; document.querySelectorAll('.coaFechaFirma').forEach(e => e.textContent = formatearFecha(res.fechaAnalisis)); document.getElementById('modalCertificadoOverlay').classList.remove('hidden');
    }
    function cerrarCertificado() { document.getElementById('modalCertificadoOverlay').classList.add('hidden'); }
    function exportarPDFOficial() { if (google) { showToast("â³ Generando PDF..."); google.script.run.withSuccessHandler(r => { if (r.success) window.open(r.url, '_blank'); else showToast(r.error); }).generarPDFMasivoEnServidor([document.getElementById('coaLote').textContent], sessionUser); } }
    function descargarCoAsMasivo() { const l = Array.from(document.querySelectorAll('.tanda-chk')).filter(c => c.checked).map(c => c.value); if (l.length > 0 && google) { showToast("â³ Generando PDFs..."); google.script.run.withSuccessHandler(r => { if (r.success) window.open(r.url, '_blank'); }).generarPDFMasivoEnServidor(l, sessionUser); } }

    // ==========================================
    // ðŸ“¦ INVENTARIOS Y CEPARIO
    // ==========================================
    /**
     * ðŸ”„ CARGA INICIAL
     * Se conecta al cerebro modular (Inventarios.gs)
     */
    function cargarInventariosCompletos() {
        if (!google) return;

        // Mostramos un loader visual antes de empezar
        const tb = document.getElementById('tablaInventariosBody');
        tb.innerHTML = `<tr><td colspan="7" class="py-20 text-center"><div class="inline-block loader rounded-full border-4 border-t-blue-600 h-10 w-10"></div><p class="text-slate-400 mt-4 font-medium">Sincronizando bodega...</p></td></tr>`;

        google.script.run
            .withSuccessHandler(r => {
                if (r.success) {
                    // Guardamos la respuesta del cerebro en el estado global
                    inventarioDataGlobal = {
                        stock: r.stock || [],
                        preparaciones: r.preparaciones || [],
                        cepas: r.cepas || []
                    };
                    renderTablaInventarios();
                } else {
                    showToast("âŒ Error al cargar bodega: " + r.error);
                }
            })
            .obtenerInventariosCompletos();
    }

    /**
     * ðŸ“‘ NAVEGACIÃ“N DE PESTAÃ‘AS
     */
    function cambiarTabInventario(t) {
        tabInventarioActiva = t;

        // ActualizaciÃ³n visual de tabs usando clases declarativas
        const tabs = {
            'STOCK': 'tabInvStock',
            'PREP': 'tabInvPrep',
            'CEPAS': 'tabInvCepas'
        };

        Object.values(tabs).forEach(id => {
            const el = document.getElementById(id);
            const isActive = id === tabs[t];
            el.classList.toggle('border-blue-600', isActive);
            el.classList.toggle('text-blue-600', isActive);
            el.classList.toggle('border-transparent', !isActive);
            el.classList.toggle('text-slate-400', !isActive);
        });

        // Control de botones de acciÃ³n
        document.getElementById('btnAltaInsumoGral').classList.toggle('hidden', t !== 'STOCK');
        document.getElementById('btnAltaCepaGral').classList.toggle('hidden', t !== 'CEPAS');

        renderTablaInventarios();
    }

    /**
     * ðŸŽ¨ MOTOR DE RENDERIZADO
     */
    function renderTablaInventarios() {
        const th = document.getElementById('tablaInventariosHead');
        const tb = document.getElementById('tablaInventariosBody');
        const term = document.getElementById('busquedaInventario')?.value.toLowerCase().trim() || '';
        const sortVal = document.getElementById('ordenInventario')?.value || 'recientes';

        let h = '';
        const thCls = "bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200";

        // 1. ConfiguraciÃ³n de Columnas segÃºn Tab
        const config = {
            'STOCK': {
                headers: `<tr><th class="px-4 py-3 w-10"></th><th>Insumo</th><th>Lote Prov.</th><th>Caducidad</th><th class="text-center">Estatus</th><th class="text-center">AcciÃ³n</th></tr>`,
                filter: (i) => !term || i.nombre.toLowerCase().includes(term) || i.loteProv.toLowerCase().includes(term),
                sortFields: ['nombre', 'caducidad']
            },
            'PREP': {
                headers: `<tr><th class="px-4 py-3 w-10"></th><th>Lote Interno</th><th>Detalles</th><th>Preparado</th><th class="text-center">Estatus</th><th class="text-center">AcciÃ³n</th></tr>`,
                filter: (i) => !term || i.lote.toLowerCase().includes(term) || i.receta.toLowerCase().includes(term) || i.tipo.toLowerCase().includes(term),
                sortFields: ['lote', 'fechaPrep']
            },
            'CEPAS': {
                headers: `<tr><th class="px-4 py-3 w-10"></th><th>Microorganismo</th><th>Tubo</th><th class="text-center">Pase</th><th>Caducidad</th><th class="text-center">Estatus</th><th class="text-center">AcciÃ³n</th></tr>`,
                filter: (i) => !term || i.microorganismo.toLowerCase().includes(term) || i.idTubo?.toLowerCase().includes(term),
                sortFields: ['microorganismo', 'fechaRehid']
            }
        };

        const current = config[tabInventarioActiva];
        th.innerHTML = `<tr class="${thCls}">${current.headers}</tr>`;

        // 2. Filtrado y Ordenamiento
        let data = [...(inventarioDataGlobal[tabInventarioActiva.toLowerCase()] || inventarioDataGlobal.stock)];
        if (tabInventarioActiva === 'STOCK') data = [...inventarioDataGlobal.stock];
        if (tabInventarioActiva === 'PREP') data = [...inventarioDataGlobal.preparaciones];
        if (tabInventarioActiva === 'CEPAS') data = [...inventarioDataGlobal.cepas];

        const dataFiltrada = data.filter(current.filter);

        // Motor de ordenamiento inteligente
        dataFiltrada.sort((a, b) => {
            const inactivos = ['agotado', 'rechazado', 'caducado', 'inactiva'];
            const aIn = inactivos.includes(String(a.estatus).toLowerCase()) ? 1 : 0;
            const bIn = inactivos.includes(String(b.estatus).toLowerCase()) ? 1 : 0;
            if (aIn !== bIn) return aIn - bIn;

            if (sortVal === 'nombre_asc') return String(a[current.sortFields[0]]).localeCompare(String(b[current.sortFields[0]]));
            return new Date(b[current.sortFields[1]]) - new Date(a[current.sortFields[1]]);
        });

        // 3. GeneraciÃ³n de Filas (Loop)
        dataFiltrada.forEach(item => {
            const estatus = (item.estatus || 'Sin Rehidratar').trim();
            const infoBadge = getEstatusStyle(estatus);
            const isInactive = ['Agotado', 'Rechazado', 'Caducado', 'Inactiva'].includes(estatus);
            const idFinal = item.idInsumo || item.lote || item.idTubo || item.loteProv;

            h += `<tr class="${isInactive ? 'opacity-50 bg-slate-50' : 'hover:bg-blue-50/50'} transition-all border-b border-slate-100">
                <td class="px-4 py-4 text-center">
                    <input type="checkbox" class="inv-chk w-4 h-4 text-blue-600 rounded" value="${idFinal}" onchange="toggleCheckboxInv()">
                </td>`;

            if (tabInventarioActiva === 'STOCK') {
                h += `<td class="px-4 py-4 font-bold text-slate-800">${item.nombre}</td>
                  <td class="px-4 py-4 font-mono text-blue-700 text-xs">${item.loteProv}</td>
                  <td class="px-4 py-4 text-slate-500 text-sm">${formatearFecha(item.caducidad)}</td>
                  <td class="px-4 py-4 text-center"><span class="px-2 py-1 rounded-md text-[10px] font-black uppercase ${infoBadge}">${estatus}</span></td>
                  <td class="px-4 py-4 text-center"><button onclick="abrirCambioEstatusInv('${item.loteProv}','STOCK','${estatus}')" class="btn-editar">Editar</button></td>`;
            }
            else if (tabInventarioActiva === 'PREP') {
                h += `<td class="px-4 py-4 font-mono font-bold text-indigo-700">${item.lote}</td>
                  <td class="px-4 py-4 text-xs text-slate-600"><b>${item.tipo}</b><br>${item.receta}</td>
                  <td class="px-4 py-4 text-slate-500 text-sm">${formatearFecha(item.fechaPrep)}</td>
                  <td class="px-4 py-4 text-center"><span class="px-2 py-1 rounded-md text-[10px] font-black uppercase ${infoBadge}">${estatus}</span></td>
                  <td class="px-4 py-4 text-center"><button onclick="abrirCambioEstatusInv('${item.lote}','PREP','${estatus}')" class="btn-editar">Editar</button></td>`;
            }
            else {
                const btnCepa = getCepaActions(item);
                h += `<td class="px-4 py-4 font-bold italic text-slate-800">${item.microorganismo}</td>
                  <td class="px-4 py-4 font-mono text-indigo-700 text-xs">${item.idTubo || '-'}</td>
                  <td class="px-4 py-4 text-center font-bold ${item.pases >= 5 ? 'text-red-600' : 'text-blue-600'}">${item.pases || '0'}</td>
                  <td class="px-4 py-4 text-slate-500 text-sm">${formatearFecha(item.caducidad || item.caducidadProv)}</td>
                  <td class="px-4 py-4 text-center"><span class="px-2 py-1 rounded-md text-[10px] font-black uppercase ${infoBadge}">${estatus}</span></td>
                  <td class="px-4 py-4 text-center w-40">${btnCepa}</td>`;
            }
            h += `</tr>`;
        });

        tb.innerHTML = h || `<tr><td colspan="7" class="py-12 text-center text-slate-400 italic">No se encontraron resultados</td></tr>`;
    }

    /**
     * ðŸ› ï¸ HELPERS VISUALES
     */
    function getEstatusStyle(e) {
        const styles = {
            'Liberado': 'bg-emerald-100 text-emerald-700',
            'Activa': 'bg-emerald-100 text-emerald-700',
            'Cuarentena': 'bg-amber-100 text-amber-700',
            'Rechazado': 'bg-red-100 text-red-700',
            'Caducado': 'bg-red-100 text-red-700',
            'Agotado': 'bg-slate-200 text-slate-600',
            'Inactiva': 'bg-slate-200 text-slate-600',
            'Sin Rehidratar': 'bg-blue-50 text-blue-600 border border-blue-100'
        };
        return styles[e] || 'bg-slate-100 text-slate-500';
    }

    function getCepaActions(i) {
        const est = i.estatus || 'Sin Rehidratar';
        if (est === 'Sin Rehidratar') {
            return `<button onclick="abrirModalCepa('${i.atcc}','${i.idTubo}','${i.microorganismo}','REHIDRATAR',${i.pases},'${i.loteProv}')" class="btn-cepa-primary"><i class="fas fa-tint"></i> Rehidratar</button>`;
        }
        if (est === 'Activa') {
            const btnBaja = `<button onclick="abrirModalCepa('${i.atcc}','${i.idTubo}','${i.microorganismo}','INACTIVAR',${i.pases},'${i.loteProv}')" class="btn-cepa-danger"><i class="fas fa-fire"></i></button>`;
            if (i.idTubo.endsWith('-CLS')) {
                return `<div class="flex gap-2"><button onclick="abrirModalCepa('${i.atcc}','${i.idTubo}','${i.microorganismo}','NUEVA_RAMA',${i.pases},'${i.loteProv}')" class="btn-cepa-success flex-1">Cref</button>${btnBaja}</div>`;
            }
            if (i.idTubo.endsWith('R')) {
                if (i.pases >= 5) return `<div class="flex gap-2"><span class="badge-limit">LÃ­mite</span>${btnBaja}</div>`;
                return `<div class="flex gap-2"><button onclick="abrirModalCepa('${i.atcc}','${i.idTubo}','${i.microorganismo}','SUBCULTIVO',${i.pases},'${i.loteProv}')" class="btn-cepa-success flex-1">Pase</button>${btnBaja}</div>`;
            }
            return btnBaja;
        }
        return '-';
    }

    function toggleCheckboxInv() { const chk = Array.from(document.querySelectorAll('.inv-chk')).filter(c => c.checked); if (chk.length > 0) { document.getElementById('actionBarInv').classList.remove('hidden'); document.getElementById('countInv').textContent = chk.length; } else document.getElementById('actionBarInv').classList.add('hidden'); }
    function abrirCambioEstatusMasivoInv() { const arr = Array.from(document.querySelectorAll('.inv-chk')).filter(c => c.checked).map(c => c.value); itemInventarioSeleccionado = { id: arr, tipo: tabInventarioActiva }; document.getElementById('lblLoteCambioEst').textContent = `[${arr.length}] elementos`; document.getElementById('inputJustificacionInv').value = ''; document.getElementById('modalEstatusInventario').classList.remove('hidden'); }
    function abrirCambioEstatusInv(lote, tipo, estAct) { itemInventarioSeleccionado = { id: [lote], tipo: tipo }; document.getElementById('lblLoteCambioEst').textContent = lote; document.getElementById('inputJustificacionInv').value = ''; document.getElementById('selectNuevoEstatusInv').value = estAct === 'Cuarentena' ? 'Liberado' : 'Agotado'; document.getElementById('modalEstatusInventario').classList.remove('hidden'); }
    function procederFirmaInventario() { tipoFirmaGlobal = 'INVENTARIO_MASIVO'; document.getElementById('modalEstatusInventario').classList.add('hidden'); solicitarFirmaParaDictamen("INV", ""); }
    function abrirModalNuevoInsumo() { document.querySelector('#modalNuevoInsumo form').reset(); document.getElementById('modalNuevoInsumo').classList.remove('hidden'); }
    function cerrarModalNuevoInsumo() { document.getElementById('modalNuevoInsumo').classList.add('hidden'); }
    function handleAltaInsumo(e) { e.preventDefault(); if (google) google.script.run.withSuccessHandler(r => { if (r.success) { cerrarModalNuevoInsumo(); cargarInventariosCompletos(); showToast("âœ… Insumo registrado."); } }).registrarNuevoInsumo({ categoria: document.getElementById('insumoCategoria').value, nombre: document.getElementById('insumoNombre').value, proveedor: document.getElementById('insumoProveedor').value, loteProv: document.getElementById('insumoLote').value, presentacion: document.getElementById('insumoPresentacion').value, caducidad: document.getElementById('insumoCaducidad').value, pm: document.getElementById('insumoPM').value, pureza: document.getElementById('insumoPureza').value, factor: 0, densidad: 0 }, sessionUser); }
    function abrirModalAltaCepa() { document.querySelector('#modalAltaCepa form').reset(); document.getElementById('modalAltaCepa').classList.remove('hidden'); }
    function handleAltaCepa(e) { e.preventDefault(); if (google) google.script.run.withSuccessHandler(r => { if (r.success) { document.getElementById('modalAltaCepa').classList.add('hidden'); cargarInventariosCompletos(); showToast("âœ… Cepa registrada."); } }).registrarNuevaCepa({ microorganismo: document.getElementById('altaCepaMicro').value, atcc: document.getElementById('altaCepaATCC').value, loteProv: document.getElementById('altaCepaLoteProv').value, cantidad: document.getElementById('altaCepaCantidad').value, paseProv: document.getElementById('altaCepaPase').value, caducidadProv: document.getElementById('altaCepaCadProv').value }, sessionUser); }

    function toggleInputsCepa(v) { const lId = document.getElementById('lblIdentificadorCepa'), lLote = document.getElementById('lblLoteCepa'), iId = document.getElementById('altaCepaATCC'), iLote = document.getElementById('altaCepaLoteProv'); if (v === 'Nativo') { lId.textContent = "ID Interno *"; iId.placeholder = "Ej. ISO-EC-001"; lLote.textContent = "Ref. BitÃ¡cora *"; iLote.placeholder = "Ej. BIT-MIC-2024"; } else { lId.textContent = "NÃºmero ATCC *"; iId.placeholder = "Ej. 8739"; lLote.textContent = "Lote Proveedor *"; iLote.placeholder = ""; } }
    function abrirModalCepa(atcc, idTubo, micro, accion, pasesActuales, loteProv) { cepaSeleccionada = { atcc, idTubo, microorganismo: micro, accion, loteProv }; document.getElementById('lblNombreCepa').textContent = micro; document.getElementById('lblAtccCepa').textContent = idTubo || atcc; document.getElementById('inputFirmaCepa').value = '';['divCepaAbreviatura', 'divCepaPaseInicial', 'divCepaLetraRama', 'divCepaCantTrabajo', 'divCepaCaducidad', 'divCepaJustificacion'].forEach(id => document.getElementById(id).classList.add('hidden')); if (accion === 'REHIDRATAR') { document.getElementById('tituloModalCepa').innerHTML = `<i class="fas fa-tint text-blue-500 mr-2"></i> Alta a Lote Semilla`;['divCepaAbreviatura', 'divCepaPaseInicial', 'divCepaCaducidad'].forEach(id => document.getElementById(id).classList.remove('hidden')); document.getElementById('inputCepaPaseInicial').value = pasesActuales > 0 ? pasesActuales : ''; } else if (accion === 'NUEVA_RAMA') { document.getElementById('tituloModalCepa').innerHTML = `<i class="fas fa-code-branch text-emerald-500 mr-2"></i> Crear Cultivos Referencia`;['divCepaLetraRama', 'divCepaCantTrabajo', 'divCepaCaducidad'].forEach(id => document.getElementById(id).classList.remove('hidden')); } else if (accion === 'SUBCULTIVO') { document.getElementById('tituloModalCepa').innerHTML = `<i class="fas fa-redo text-emerald-500 mr-2"></i> Subcultivo (Pase ${pasesActuales + 1})`;['divCepaCantTrabajo', 'divCepaCaducidad'].forEach(id => document.getElementById(id).classList.remove('hidden')); } else if (accion === 'INACTIVAR') { document.getElementById('tituloModalCepa').innerHTML = `<i class="fas fa-fire text-red-500 mr-2"></i> Inactivar / Consumir`; document.getElementById('divCepaJustificacion').classList.remove('hidden'); } document.getElementById('modalCepa').classList.remove('hidden'); }

    function procesarFirmaCepa() { const p = document.getElementById('inputFirmaCepa').value; if (!p) return showToast("âš ï¸ Ingresa tu firma electrÃ³nica."); const btn = document.getElementById('btnGuardarCepa'); if (btn) setLoading(btn, 'btnGuardarCepaText', 'btnGuardarCepaLoader', true, 'Firmando...'); const datosCepa = { loteProv: cepaSeleccionada.loteProv, abreviatura: document.getElementById('inputCepaAbreviatura').value.trim(), caducidad: document.getElementById('inputCepaCaducidad').value, paseInicial: document.getElementById('inputCepaPaseInicial').value, justificacion: document.getElementById('inputCepaJustificacion').value.trim(), letraRama: document.getElementById('inputCepaLetra').value.trim(), cantL: document.getElementById('inputCepaCantL').value }; if (google) { google.script.run.withSuccessHandler(r => { if (btn) setLoading(btn, 'btnGuardarCepaText', 'btnGuardarCepaLoader', false, 'Firmar'); if (r.success) { document.getElementById('modalCepa').classList.add('hidden'); cargarInventariosCompletos(); showToast("âœ… Movimiento de cepa registrado."); } else { showToast("âŒ Error: " + r.error); } }).withFailureHandler(err => { if (btn) setLoading(btn, 'btnGuardarCepaText', 'btnGuardarCepaLoader', false, 'Firmar'); showToast("âŒ Error de conexiÃ³n al firmar."); }).procesarMovimientoCepa(cepaSeleccionada.atcc, cepaSeleccionada.idTubo, cepaSeleccionada.microorganismo, cepaSeleccionada.accion, datosCepa, sessionUser, p); } }

    // ==========================================
    // ðŸ§ª CALCULADORA Y ALERTAS
    // ==========================================
    function cargarDatosCalculadora() { if (google) google.script.run.withSuccessHandler(d => inventarioReactivos = d).obtenerInventarioRecepcion(); }
    function calcularRequerimientoPreparacion(id, tipo, volML, conc, eq = 1) { try { const r = inventarioReactivos.find(x => x.idInsumo === id); if (!r) return { error: "Reactivo no encontrado." }; let vL = parseFloat(volML) / 1000, c = parseFloat(conc); if (tipo === 'Medio Simple') { if (!r.factorPrep || r.factorPrep <= 0) return { error: "Falta Factor Prep en BD." }; return { tipo: 'Solido', unidad: 'g', teorico: (r.factorPrep * vL).toFixed(3), mensaje: `Pesar ${(r.factorPrep * vL).toFixed(3)} g.` }; } if (tipo === 'SoluciÃ³n Molar' || tipo === 'SoluciÃ³n Normal') { if (!r.pm || r.pm <= 0) return { error: "Falta PM en BD." }; let pur = r.pureza > 0 ? r.pureza / 100 : 1; let pmAj = tipo === 'SoluciÃ³n Normal' ? r.pm / parseFloat(eq) : r.pm; let masa = (c * vL * pmAj) / pur; let den = parseFloat(r.densidad); if (den > 0) return { tipo: 'Liquido', unidad: 'mL', teorico: (masa / den).toFixed(2), mensaje: `Medir ${(masa / den).toFixed(2)} mL.` }; return { tipo: 'Solido', unidad: 'g', teorico: masa.toFixed(4), mensaje: `Pesar ${masa.toFixed(4)} g (âš ï¸ Sin densidad).` }; } if (tipo === '% m/v') return { tipo: 'Solido', unidad: 'g', teorico: (((c * parseFloat(volML)) / 100) / (r.pureza > 0 ? r.pureza / 100 : 1)).toFixed(3), mensaje: `Pesar ${(((c * parseFloat(volML)) / 100) / (r.pureza > 0 ? r.pureza / 100 : 1)).toFixed(3)} g.` }; return { error: "CÃ¡lculo no configurado." }; } catch (e) { return { error: e.message }; } }
    function ejecutarCalculoEnVivo() { const tipo = document.getElementById('prepTipo').value, rId = document.getElementById('prepReactivo').value, vol = document.getElementById('prepVolumen').value, conc = document.getElementById('prepConcentracion').value, eq = document.getElementById('prepEquivalentes').value || 1; const a = document.getElementById('prepAlertaCalculo'), m = document.getElementById('prepMensajeCalculo'), lu = document.getElementById('prepUnidadReal'); if (!tipo || !rId || !vol || (tipo !== 'Medio Simple' && !conc)) { a.style.display = 'none'; return; } const res = calcularRequerimientoPreparacion(rId, tipo, vol, conc, eq); a.style.display = 'block'; a.classList.remove('hidden'); if (res.error) { a.className = 'bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mt-4'; m.innerHTML = `<span class="text-red-600 font-bold">${res.error}</span>`; lu.textContent = '-'; document.getElementById('prepValorTeorico').value = ''; } else { a.className = res.mensaje.includes('âš ï¸') ? 'bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mt-4' : 'bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mt-4'; m.innerHTML = `<strong>${res.mensaje}</strong>`; lu.textContent = res.unidad; document.getElementById('prepValorTeorico').value = res.teorico; } }

    function actualizarInterfazCalculadora() {
        const t = document.getElementById('prepTipo').value;
        const dc = document.getElementById('divConcentracion'), ic = document.getElementById('prepConcentracion');
        const dv = document.getElementById('divValoracion'), lc = document.getElementById('lblConcentracion'), de = document.getElementById('divEquivalentes');
        const dPh = document.getElementById('divControlPH'), iPh = document.getElementById('prepPhFinal');

        if (t === 'SoluciÃ³n Normal') de.classList.remove('hidden'); else de.classList.add('hidden');

        if (t === 'Medio Simple') {
            dc.classList.add('hidden'); ic.required = false; ic.value = ''; dv.classList.add('hidden');
            if (dPh) dPh.classList.remove('hidden');
            if (iPh) iPh.required = true;
        } else {
            dc.classList.remove('hidden'); ic.required = true;
            lc.textContent = t.includes('Molar') ? 'Molaridad (M)*' : (t.includes('Normal') ? 'Normalidad (N)*' : 'Porcentaje (%)*');
            if (t.includes('Molar') || t.includes('Normal')) dv.classList.remove('hidden'); else dv.classList.add('hidden');
            if (dPh) dPh.classList.add('hidden');
            if (iPh) iPh.required = false;
        }

        const dl = document.getElementById('listaPrepReactivos');
        if (dl) dl.innerHTML = '';
        if (document.getElementById('prepReactivoNombre')) document.getElementById('prepReactivoNombre').value = '';
        if (document.getElementById('prepReactivo')) document.getElementById('prepReactivo').value = '';

        let reactivosFiltrados = [];
        if (t === 'Medio Simple') {
            reactivosFiltrados = inventarioReactivos.filter(r => String(r.categoria).toLowerCase().includes('medio'));
        } else if (t !== '') {
            reactivosFiltrados = inventarioReactivos.filter(r => !String(r.categoria).toLowerCase().includes('medio') && !String(r.categoria).toLowerCase().includes('estÃ¡ndar'));
        }

        if (dl && reactivosFiltrados.length > 0) {
            reactivosFiltrados.forEach(r => {
                let o = document.createElement('option');
                o.value = `${r.nombre} [Lote: ${r.loteProv}]`;
                o.setAttribute('data-id', r.idInsumo);
                dl.appendChild(o);
            });
        }
        ejecutarCalculoEnVivo();
    }

    function seleccionarReactivoEnVivo() { const v = document.getElementById('prepReactivoNombre').value, opts = document.getElementById('listaPrepReactivos').options; let id = ''; for (let i = 0; i < opts.length; i++) if (opts[i].value === v) { id = opts[i].getAttribute('data-id'); break; } document.getElementById('prepReactivo').value = id; ejecutarCalculoEnVivo(); }
    function abrirModalPreparacion() { document.getElementById('formPreparacion').reset(); document.getElementById('prepAlertaCalculo').style.display = 'none'; document.getElementById('divConcentracion').classList.add('hidden'); document.getElementById('divValoracion').classList.add('hidden'); document.getElementById('divEquivalentes').classList.add('hidden'); document.getElementById('prepReactivoNombre').value = ''; document.getElementById('prepReactivo').value = ''; document.getElementById('listaPrepReactivos').innerHTML = ''; document.getElementById('modalPreparacionOverlay').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
    function cerrarModalPreparacion() { document.getElementById('modalPreparacionOverlay').classList.add('hidden'); document.body.style.overflow = 'auto'; }
    function handleGuardarPreparacion(e) { e.preventDefault(); const btn = document.getElementById('btnGuardarPrep'), rId = document.getElementById('prepReactivo').value, r = inventarioReactivos.find(x => String(x.idInsumo) === String(rId)); if (!r) return showToast("âŒ Seleccione un reactivo vÃ¡lido."); const dPhI = document.getElementById('prepPhInicial'), dPhF = document.getElementById('prepPhFinal'); const d = { tipo: document.getElementById('prepTipo').value, idInsumoBase: rId, nombreReactivo: r.nombre, loteProv: r.loteProv, volumenFinal: document.getElementById('prepVolumen').value, volumenTeorico: document.getElementById('prepValorTeorico').value, unidad: document.getElementById('prepUnidadReal').textContent, cantidadReal: document.getElementById('prepCantidadReal').value, concentracionReal: document.getElementById('prepConcentracionReal').value || null, caducidadInterna: document.getElementById('prepCaducidad').value, estatusInicial: document.getElementById('prepTipo').value === 'Medio Simple' ? 'Cuarentena' : 'Liberado', phInicial: dPhI ? dPhI.value : '', phFinal: dPhF ? dPhF.value : '' }; setLoading(btn, 'btnGuardarPrepText', 'btnGuardarPrepLoader', true, 'Generando...'); if (google) google.script.run.withSuccessHandler(res => { setLoading(btn, 'btnGuardarPrepText', 'btnGuardarPrepLoader', false, 'Generar'); if (res.success) { cerrarModalPreparacion(); showToast(`âœ… Lote: ${res.loteInterno}`); cargarMuestras(); cargarInventariosCompletos(); } else showToast(`âŒ ${res.error}`); }).guardarNuevaPreparacion(d, sessionUser); }

    function cargarAlertasCaducidad() { const c = document.getElementById('listaAlertasCaducidad'); if (!c) return; if (google) google.script.run.withSuccessHandler((alt) => { const ce = document.getElementById('countAlertas'); if (ce) ce.textContent = alt.length; if (alt.length === 0) return c.innerHTML = `<div class="p-4 text-center bg-emerald-50 rounded-2xl"><i class="fas fa-check-circle text-emerald-500"></i><p class="text-[10px] font-bold text-emerald-800">Todo en vigencia</p></div>`; let h = ''; alt.forEach(a => h += `<div class="p-3 rounded-xl border ${a.diasRestantes <= 15 ? 'border-red-200 bg-red-50 text-red-700' : 'border-amber-200 bg-amber-50 text-amber-700'} mb-2"><div class="flex justify-between mb-1"><span class="text-[9px] font-bold uppercase">${a.categoria}</span><span class="text-[10px] font-mono font-bold">${a.diasRestantes < 0 ? 'VENCIDO' : a.diasRestantes + ' dÃ­as'}</span></div><p class="text-xs font-bold text-slate-800">${a.nombre}</p><p class="text-[10px] text-slate-500">Lote: ${a.lote}</p></div>`); c.innerHTML = h; }).obtenerAlertasCaducidad(); }

    // ==========================================
    // ðŸ‘¥ USUARIOS
    // ==========================================
    function cargarUsuarios() { const tb = document.getElementById('tablaUsuariosBody'); tb.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center"><div class="loader inline-block rounded-full border-t-blue-600 h-6 w-6"></div></td></tr>`; if (google) google.script.run.withSuccessHandler(renderizarTablaUsuarios).withFailureHandler(() => tb.innerHTML = `<tr><td colspan="7" class="text-center text-red-500 py-4 font-bold">Error de conexiÃ³n</td></tr>`).obtenerUsuariosBD(); }
    function renderizarTablaUsuarios(u) { const tb = document.getElementById('tablaUsuariosBody'); if (!u || u.length === 0) return tb.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-500"><i class="fas fa-users text-4xl mb-3 block text-slate-300"></i>No hay usuarios registrados.</td></tr>`; let h = ''; u.forEach(x => { let bCls = x.estatus === 'Activo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'; h += `<tr class="hover:bg-blue-50 transition-colors border-b border-slate-100"><td class="px-6 py-4 font-mono text-sm text-slate-400">${x.id}</td><td class="px-6 py-4 font-bold text-slate-800 text-sm"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">${x.nombre.charAt(0)}</div>${x.nombre}</div></td><td class="px-6 py-4 text-sm font-medium text-slate-600">${x.usuario}</td><td class="px-6 py-4 font-bold text-indigo-700 text-sm">${x.rol}</td><td class="px-6 py-4 italic text-sm text-slate-500">${x.area}</td><td class="px-6 py-4"><span class="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${bCls}">${x.estatus}</span></td><td class="px-6 py-4 text-center"><button onclick="prepararEdicionUsuario('${x.id}','${x.nombre}','${x.usuario}','${x.rol}','${x.area}','${x.estatus}')" class="bg-white border border-slate-200 shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg transition-colors"><i class="fas fa-edit"></i></button></td></tr>`; }); tb.innerHTML = h; }
    function abrirModalUsuario(id = '') { document.getElementById('formUsuario').reset(); document.getElementById('formUserId').value = id || 'Autogenerado al guardar'; document.getElementById('hashOutput').value = ''; document.getElementById('modalUsuario').classList.remove('hidden'); }
    function prepararEdicionUsuario(id, nom, usu, rol, ar, est) { document.getElementById('formUserId').value = id; document.getElementById('formUserNombre').value = nom; document.getElementById('formUserLogin').value = usu; document.getElementById('formUserRol').value = rol; document.getElementById('formUserArea').value = ar; document.getElementById('formUserEstatus').value = est; document.getElementById('hashOutput').value = ''; document.getElementById('formUserJustificacion').value = ''; document.getElementById('modalUsuario').classList.remove('hidden'); }
    function cerrarModalUsuario() { document.getElementById('modalUsuario').classList.add('hidden'); }
    function generarClaveTemporal() { let c = ""; const ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*"; for (let i = 0; i < 10; i++) c += ch.charAt(Math.floor(Math.random() * ch.length)); document.getElementById('hashOutput').value = "Temp_" + c; showToast("â„¹ï¸ Clave temporal generada."); }
    function guardarUsuarioBD(e) { e.preventDefault(); const id = document.getElementById('formUserId').value, ct = document.getElementById('hashOutput').value, just = document.getElementById('formUserJustificacion').value.trim(); if (!just || just.length < 10) return showToast("âŒ Error BPF: JustificaciÃ³n detallada obligatoria."); if ((id === 'Autogenerado al guardar' || !id) && !ct) return showToast("âŒ Error: Debe generar clave temporal."); const btn = document.getElementById('btnGuardarUser'); setLoading(btn, 'btnGuardarUserText', 'btnGuardarUserLoader', true, 'Guardando...'); if (google) google.script.run.withSuccessHandler(r => { setLoading(btn, 'btnGuardarUserText', 'btnGuardarUserLoader', false, 'Guardar Usuario'); if (r.success) { cerrarModalUsuario(); cargarUsuarios(); showToast("âœ… " + r.mensaje); } else showToast("âŒ Error: " + r.error); }).gestionarUsuario({ id: id === 'Autogenerado al guardar' ? '' : id, nombre: document.getElementById('formUserNombre').value.trim(), usuario: document.getElementById('formUserLogin').value.trim(), rol: document.getElementById('formUserRol').value, area: document.getElementById('formUserArea').value, estatus: document.getElementById('formUserEstatus').value, justificacion: just, clavePlana: ct, autorizador: sessionUser }); }

    // ==========================================
    // ðŸ›¡ï¸ AUDIT TRAIL Y EQUIPOS
    // ==========================================
    function cargarAuditTrail() { if (google) google.script.run.withSuccessHandler(r => { auditTrailDataGlobal = r; filtrarAuditTrail(); }).obtenerAuditTrailBD(); }
    function limpiarFiltrosAudit() { document.getElementById('filtroAuditTexto').value = ''; document.getElementById('filtroAuditModulo').value = ''; document.getElementById('filtroAuditUsuario').value = ''; filtrarAuditTrail(); }
    function filtrarAuditTrail() { const tb = document.getElementById('tablaAuditTrailBody'), tx = document.getElementById('filtroAuditTexto').value.toLowerCase(), md = document.getElementById('filtroAuditModulo').value.toLowerCase(), us = document.getElementById('filtroAuditUsuario').value.toLowerCase(); let fl = auditTrailDataGlobal.filter(i => (!tx || (i.accion + ' ' + i.detalle).toLowerCase().includes(tx)) && (!md || i.modulo.toLowerCase().includes(md)) && (!us || i.usuario.toLowerCase().includes(us))).slice(0, 500); if (fl.length === 0) { tb.innerHTML = `<tr><td colspan="5" class="text-center py-12 text-slate-400"><i class="fas fa-search text-4xl mb-3 block text-slate-300"></i>Sin registros que coincidan</td></tr>`; return; } let h = ''; fl.forEach(i => { let colorAccion = "text-slate-800"; if (i.accion.includes('Firma') || i.accion.includes('Dictamen') || i.accion.includes('LiberaciÃ³n')) colorAccion = "text-indigo-700"; if (i.accion.includes('Fallido') || i.accion.includes('Error') || i.accion.includes('Bloqueo') || i.accion.includes('Inactivar')) colorAccion = "text-red-600"; h += `<tr class="hover:bg-slate-50 transition-colors border-b border-slate-100"><td class="px-5 py-4 text-[11px] font-mono text-slate-500 whitespace-nowrap">${i.fecha}</td><td class="px-5 py-4 text-xs font-bold text-slate-800">${i.usuario}</td><td class="px-5 py-4 text-[10px] uppercase font-bold text-slate-400 tracking-wider">${i.modulo}</td><td class="px-5 py-4 text-xs font-extrabold ${colorAccion}">${i.accion}</td><td class="px-5 py-4 text-xs text-slate-600 leading-relaxed font-medium">${i.detalle}</td></tr>` }); tb.innerHTML = h; }

    //
    function cargarEquipos() {
        const tb = document.getElementById('tablaEquiposBody');
        tb.innerHTML = `<tr><td colspan="5" class="px-4 py-12 text-center"><div class="inline-block loader rounded-full border-t-blue-600 h-8 w-8"></div></td></tr>`;

        if (google) google.script.run.withSuccessHandler(r => {
            if (!r.equipos || r.equipos.length === 0) {
                tb.innerHTML = `<tr><td colspan="5" class="text-center py-12 text-slate-400">Sin equipos registrados.</td></tr>`;
                return;
            }
            let h = '';
            const hoy = new Date();
            r.equipos.forEach(e => {
                let badge = 'bg-emerald-100 text-emerald-700';
                let txt = 'Vigente';
                if (e.proxima) {
                    const diff = Math.ceil((new Date(e.proxima) - hoy) / (1000 * 60 * 60 * 24));
                    if (diff < 0) { badge = 'bg-red-100 text-red-700'; txt = 'Vencido'; }
                    else if (diff <= 30) { badge = 'bg-amber-100 text-amber-700'; txt = 'Por Vencer'; }
                }
                h += `<tr class="hover:bg-blue-50 transition-colors border-b border-slate-100">
                <td class="px-4 py-5 font-mono font-bold text-indigo-700 text-sm">${e.codigo}</td>
                <td class="px-4 py-5"><span class="font-bold text-slate-800 block text-sm">${e.equipo}</span><span class="text-[10px] text-slate-500 uppercase">${e.ubicacion || 'LAB'}</span></td>
                <td class="px-4 py-5 text-center text-sm font-bold text-slate-600">${formatearFecha(e.proxima)}</td>
                <td class="px-4 py-5 text-center"><span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${badge}">${txt}</span></td>
                <td class="px-4 py-5 text-right flex gap-2 justify-end">
                    <button onclick="abrirModalMantenimiento('${e.codigo}')" class="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white" title="Registrar Servicio"><i class="fas fa-tools"></i></button>
                    <button onclick="verHistorialEquipo('${e.codigo}', '${e.equipo}')" class="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-800 hover:text-white" title="Ver Historial"><i class="fas fa-history"></i></button>
                </td>
            </tr>`;
            });
            tb.innerHTML = h;
        }).obtenerEquiposBD();
    }

    function abrirModalMantenimiento(cod) {
        document.getElementById('mantEquipoCodigo').value = cod;
        document.getElementById('mantFirma').value = '';
        document.getElementById('mantDescripcion').value = '';
        document.getElementById('modalMantenimiento').classList.remove('hidden');
    }

    function handleGuardarMantenimiento(e) {
        e.preventDefault();
        const cod = document.getElementById('mantEquipoCodigo').value;
        const pwd = document.getElementById('mantFirma').value; // ContraseÃ±a para firma CFR21
        const datos = {
            codigo: cod,
            tipo: document.getElementById('mantTipo').value,
            descripcion: document.getElementById('mantDescripcion').value,
            frecuencia: 12 // Opcional: podrÃ­as jalarlo de la tabla
        };

        setLoading(e.submitter, null, null, true, "Firmando...");

        // ðŸ’¡ CAMBIO CRÃTICO: El backend espera (datos, usuarioActual)
        // El objeto usuarioActual debe llevar 'usuario' y 'password' para que Seguridad.gs valide.
        google.script.run.withSuccessHandler(r => {
            setLoading(e.submitter, null, null, false, "Registrar");
            if (r.success) {
                document.getElementById('modalMantenimiento').classList.add('hidden');
                Swal.fire('Â¡Ã‰xito!', r.mensaje, 'success');
                cargarEquipos();
            } else {
                Swal.fire('Error de Firma', r.error, 'error');
            }
        }).registrarMantenimiento(datos, { usuario: sessionUser, password: pwd });
    }

    function verHistorialEquipo(cod, nombre) {
        document.getElementById('historialNombreEq').textContent = nombre;
        const tb = document.getElementById('historialEquiposBody');
        tb.innerHTML = '<tr><td colspan="4" class="text-center py-4">Buscando registros...</td></tr>';
        document.getElementById('modalHistorialEquipos').classList.remove('hidden');

        google.script.run.withSuccessHandler(r => {
            if (!r.success || r.historial.length === 0) {
                tb.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-400">Sin antecedentes.</td></tr>';
                return;
            }
            let h = '';
            r.historial.forEach(x => {
                h += `<tr class="border-b"><td class="py-2">${x.fecha}</td><td class="py-2 font-bold">${x.tipo}</td><td class="py-2">${x.responsable}</td><td class="py-2 text-slate-500">${x.descripcion}</td></tr>`;
            });
            tb.innerHTML = h;
        }).obtenerLogMantenimiento(cod);
    }
    function abrirModalCalibracion(cod, eq) { equipoSeleccionado = { codigo: cod, equipo: eq }; document.getElementById('lblCodigoCal').textContent = cod; document.getElementById('lblEquipoCal').textContent = eq; document.getElementById('inputFechaCal').value = new Date().toISOString().split('T')[0]; document.getElementById('inputNotasCal').value = ''; document.getElementById('inputFirmaCal').value = ''; document.getElementById('modalCalibracion').classList.remove('hidden'); }
    function procesarFirmaCalibracion(e) { e.preventDefault(); const btn = document.getElementById('btnGuardarCal'); setLoading(btn, 'btnGuardarCalText', 'btnGuardarCalLoader', true, 'Firmando...'); if (google) google.script.run.withSuccessHandler(r => { setLoading(btn, 'btnGuardarCalText', 'btnGuardarCalLoader', false, 'Firmar CalibraciÃ³n'); if (r.success) { document.getElementById('modalCalibracion').classList.add('hidden'); cargarEquipos(); cargarAlertasCaducidad(); showToast("âœ… Calibrado"); } else { showToast("âŒ Error: " + r.error); } }).withFailureHandler(() => { setLoading(btn, 'btnGuardarCalText', 'btnGuardarCalLoader', false, 'Firmar CalibraciÃ³n'); showToast("âŒ Error"); }).registrarCalibracionConFirma(equipoSeleccionado.codigo, document.getElementById('inputFechaCal').value, document.getElementById('inputNotasCal').value, sessionUser, document.getElementById('inputFirmaCal').value); }
    function abrirModalAltaEquipo() { document.getElementById('altaEqCodigo').value = ''; document.getElementById('altaEqNombre').value = ''; document.getElementById('altaEqUbicacion').value = ''; document.getElementById('altaEqProveedor').value = ''; document.getElementById('altaEqFrecuencia').value = '12'; document.getElementById('altaEqUltima').value = new Date().toISOString().split('T')[0]; document.getElementById('modalAltaEquipo').classList.remove('hidden'); }
    function handleAltaEquipo(e) { e.preventDefault(); const btn = document.getElementById('btnGuardarAltaEq'); setLoading(btn, 'btnGuardarAltaEqText', 'btnGuardarAltaEqLoader', true, 'Guardando...'); if (google) google.script.run.withSuccessHandler(r => { setLoading(btn, 'btnGuardarAltaEqText', 'btnGuardarAltaEqLoader', false, 'Guardar Equipo'); if (r.success) { document.getElementById('modalAltaEquipo').classList.add('hidden'); cargarEquipos(); showToast("âœ… Registrado"); } else { showToast("âŒ Error: " + r.error); } }).withFailureHandler(() => { setLoading(btn, 'btnGuardarAltaEqText', 'btnGuardarAltaEqLoader', false, 'Guardar Equipo'); showToast("âŒ Error"); }).registrarNuevoEquipo({ codigo: document.getElementById('altaEqCodigo').value, equipo: document.getElementById('altaEqNombre').value, ubicacion: document.getElementById('altaEqUbicacion').value, proveedor: document.getElementById('altaEqProveedor').value, frecuencia: document.getElementById('altaEqFrecuencia').value, ultima: document.getElementById('altaEqUltima').value }, sessionUser); }

    // ==========================================
    // ðŸ“ˆ ESTADÃSTICAS Y RAP
    // ==========================================
    function renderizarGraficas(datos) { let cC = 0, cA = 0, cL = 0, cR = 0; const conteoAnalistas = {}; datos.forEach(m => { if (m.estatus === 'Cuarentena') cC++; else if (m.estatus === 'En AnÃ¡lisis') cA++; else if (m.estatus === 'Liberado') cL++; else if (m.estatus === 'Rechazado') cR++; if (m.estatus !== 'Cuarentena' && m.usuario) conteoAnalistas[m.usuario] = (conteoAnalistas[m.usuario] || 0) + 1; }); const ctxEstatus = document.getElementById('chartEstatus').getContext('2d'); if (miGraficoEstatus) miGraficoEstatus.destroy(); miGraficoEstatus = new Chart(ctxEstatus, { type: 'doughnut', data: { labels: ['Pendientes', 'En Proceso', 'Liberados', 'Rechazados'], datasets: [{ data: [cC, cA, cL, cR], backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } } }); const lbls = Object.keys(conteoAnalistas); const vals = Object.values(conteoAnalistas); const ctxAnalistas = document.getElementById('chartAnalistas').getContext('2d'); if (miGraficoAnalistas) miGraficoAnalistas.destroy(); miGraficoAnalistas = new Chart(ctxAnalistas, { type: 'bar', data: { labels: lbls.length > 0 ? lbls : ['Sin datos'], datasets: [{ label: 'Muestras', data: vals.length > 0 ? vals : [0], backgroundColor: '#8b5cf6', borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } } }); }
    function abrirEstadisticas() { document.getElementById('modalEstadisticasOverlay').classList.remove('hidden'); const hoy = new Date(); const hace30Dias = new Date(hoy); hace30Dias.setDate(hoy.getDate() - 30); document.getElementById('statFechaInicio').value = hace30Dias.toISOString().split('T')[0]; document.getElementById('statFechaFin').value = hoy.toISOString().split('T')[0]; actualizarEstadisticas(); }
    function limpiarFiltrosEstadisticas() {
        document.getElementById('statFechaInicio').value = '';
        document.getElementById('statFechaFin').value = '';
        actualizarEstadisticas();
    }

    function actualizarEstadisticas() {
        const fInicioStr = document.getElementById('statFechaInicio').value;
        const fFinStr = document.getElementById('statFechaFin').value;
        let datosFiltrados = todasLasMuestras;
        let subtitulo = "HistÃ³rico Completo";

        if (fInicioStr && fFinStr) {
            const fInicio = new Date(fInicioStr + 'T00:00:00');
            const fFin = new Date(fFinStr + 'T23:59:59');
            datosFiltrados = todasLasMuestras.filter(m => {
                const fMuestra = new Date(m.fechaIngreso);
                if (isNaN(fMuestra)) return true;
                return fMuestra >= fInicio && fMuestra <= fFin;
            });
            subtitulo = `Periodo: ${formatearFecha(fInicio.toISOString())} al ${formatearFecha(fFin.toISOString())}`;
        }

        document.getElementById('statEstatusSubtitle').textContent = subtitulo;
        renderizarGraficas(datosFiltrados);
    }
    function cerrarEstadisticas() { document.getElementById('modalEstadisticasOverlay').classList.add('hidden'); }
    function initVistaInteligencia() {
        cargarKPIs();
        if (google) google.script.run.withSuccessHandler(p => {
            const s = document.getElementById('rapProducto');
            s.innerHTML = '<option value="">Seleccione...</option>';
            p.forEach(x => s.innerHTML += `<option value="${x}">${x}</option>`);
        }).obtenerListaProductos();
        setTimeout(() => { renderizarGraficas(todasLasMuestras); }, 100);
    }
    function cargarKPIs() { ['kpiLeadTime', 'kpiRFT', 'kpiRechazos', 'kpiLotes'].forEach(id => document.getElementById(id).textContent = '...'); if (google) google.script.run.withSuccessHandler(r => { if (r.success) { document.getElementById('kpiLeadTime').textContent = r.kpis.leadTimePromedio; document.getElementById('kpiRFT').textContent = r.kpis.tasaRFT + '%'; document.getElementById('kpiRechazos').textContent = r.kpis.tasaRechazo + '%'; document.getElementById('kpiLotes').textContent = r.kpis.lotesTotales; const ul = document.getElementById('listaParetoOOS'); ul.innerHTML = ''; if (r.kpis.topOOS.length === 0) ul.innerHTML = '<li class="py-3 text-emerald-600 font-bold text-center">Excelente: Sin OOS.</li>'; else r.kpis.topOOS.forEach(o => ul.innerHTML += `<li class="py-3 flex justify-between"><span>${o.prueba}</span><span class="bg-red-100 text-red-700 text-xs px-2 rounded-full">${o.cantidad} fallas</span></li>`); } }).obtenerDatosInteligenciaKPI(); }
    function generarReporteRAP() {
        const p = document.getElementById('rapProducto').value, a = document.getElementById('rapAnio').value;
        if (!p) return showToast('âš ï¸ Seleccione un producto');

        const btn = document.getElementById('btnGenerarRAP'), txt = document.getElementById('txtBtnRAP');
        btn.disabled = true; txt.textContent = 'Analizando...';

        if (google) google.script.run.withSuccessHandler(r => {
            btn.disabled = false; txt.textContent = 'Compilar Datos';

            if (r.success) {
                document.getElementById('resultadosRAP').classList.remove('hidden');

                const bodyTendencias = document.getElementById('tablaRapTendencias');
                bodyTendencias.innerHTML = '';
                r.tendencias.forEach(t => {
                    bodyTendencias.innerHTML += `
                    <tr class="border-b border-slate-50 hover:bg-slate-50">
                        <td class="py-3 font-bold text-slate-700">${t.prueba}</td>
                        <td class="py-3 text-center text-slate-500">${t.n_datos}</td>
                        <td class="py-3 text-center">${t.min}</td>
                        <td class="py-3 text-center">${t.max}</td>
                        <td class="py-3 text-center font-black text-blue-600 bg-blue-50">${t.promedio}</td>
                    </tr>`;
                });

                const bodyOOS = document.getElementById('tablaRapOOS');
                bodyOOS.innerHTML = '';
                if (r.desviacionesOOS.length === 0) {
                    bodyOOS.innerHTML = '<tr><td colspan="3" class="py-8 text-center text-emerald-500 font-bold">No se detectaron desviaciones en este periodo.</td></tr>';
                } else {
                    r.desviacionesOOS.forEach(o => {
                        bodyOOS.innerHTML += `
                        <tr class="border-b border-slate-50 text-red-600">
                            <td class="py-3 font-mono font-bold">${o.lote}</td>
                            <td class="py-3">${o.prueba}</td>
                            <td class="py-3 font-black">${o.resultado}</td>
                        </tr>`;
                    });
                }

                Swal.fire({
                    title: 'RAP Compilado',
                    text: `Se analizaron ${r.resumenLotes.totales} lotes con Ã©xito.`,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

            } else {
                showToast('âŒ ' + r.error);
            }
        }).compilarDatosRAP(p, a);
    }

