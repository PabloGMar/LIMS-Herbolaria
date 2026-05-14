// ============================================================================
// CONFIGURACIÓN INICIAL DEL LIMS
// ============================================================================
const SHEET_ID = '1YS2Ns1-EFz0OXTIZdFjLM4XLX4vOUSl9OgTCZWbMBb4';
const LOGO_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAA9UAAAEQCAYAAAC+8FcxAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAUnNJREFUeNrsvc1128gTt9vj4730RiBOBKKXdyU4AnEiEBWB6fVdCFrctekIDEVgKgJDq3dpKoKhIvhLEfiirMIYpgkSbHz1x/OcgyOPx6TI/qiuX1d19V8/fvwwAEPy1//3/0yLH6fFM9FHKP+u5KKDX/VUPJvKf6+L51n/nJd/9+P//b/P9ArAYPP/VOd7Of/L/7aZ+4+VOV3O740+zG3/x0qyNT6Syv+Wvztp8DYvOjaMjo91ZQ14LsbImpYGAIjWF9mFlf/wF6IaehbOScV5buoEjcFjxeHalD+LSbWhNwGs7UA576dqC4a2AaWgKp+cOe2sc5NUxomMm7OB7f+mMkZyeqXzPk6LHzeBfJ2Hmr/fmF8b+f9t8mFzrPzHpc1ri7ZOaMFO+2JR/JhZvFQ2LGeOjq25fqdDa4wE5mQtyJquCYhq6GKQJhXHWZyhi4C+3rZTviayAXBQHM3055mjczrXZ4XDO+o4KZ9zBz/mY2WMILIR1V2Mp436Ebkhk+aQT/nNUlT/RQt2aqdlzNpuhF8X/ZE5NKbSFvpEBHZ66PsgquHYgTkxv6IJrjpDQ/BQWRxzFkeI3C6IiJ4Xz6WHH18Wy5XO4xW92evaUW62+DZOyo2YlYps7D2iuiuhneNHIKoDnbOPRX9MHdgYyHasOQ+VufffMaBKlu20Zq2S183rNuMR1dBkQCbG7ciTK455OUFxuiAWkbRQMX0SyNd6UeGUEZ3sbP2Y6XMZ0Fe7UzvPJgyiuksezK+Nmw2iGlE9cj88d7C2vx9rLVWBnFe+g6zvS13fNw3f41T9nMXW+8x32X9ENdQNxNIRciES/XDEv3Xl3DapgxCymBYH+SrwryobZdkxCzD8MUZmJpwNl31jZMlGKqK6Y+7Vf8gQ1YjqEfpgXvz40oX/PsY5d82eyyrrz94Ic0NxLe9X3Rz+I70dUQ1VIT03zQ7vdyWSt6v1Cp0X9VADXVL+eVJ5+v6+ZfSrTDHF+QLEtF/cGaLXTW2tjJGLSMdIygYMorpjotu4QVQ70QebDn3jv4e0izsi1LfF70972mz4LRKPqEZI9yWky+uscuPBFTcqGOSZVn72FfW+N5zNA3/sRJn+hEP8uiGYIq4R04hrRPXAlKmrwYtrRPXo7S+a4GuXNrHol/mA/sqm4rt3XixtS1jLvJyW9h5RHd9kmaiQnncopMvzxGV17Dyg9qoWLCiFdpcbEJzNA9edm8xQSwFxjZhGXCOqEdeI6hjmat6DTR8kWl18dvGlyxTtPyLUxf9vInrLSv21wS+9auxT6Q+UKe6I6ngmSSmku5goUVes3HGnahdt+mJ+pXjhhIEL41wctw+0BMJpx9iYqGN/yRCIWwAhqkdDghnzEDf2ENV+tv0BPhd9sxjws+88y91QVG/b8N1FyX7ffPiZBo6oDt/xESFdrVpna7xXhmsfDk3mskJ62+JuEgXLYixQAs7YjZWJ97o8K+HU1ZktT8RR2zUlRgG0iDkjCVHdG/fq9D8HNFYQ1eO1vfidfdRNkXVy0uc43RK578prslqK6pI/i5K9+kr/VkU8ojpcgTdvOTHuza/q1Rta9aj2r14jk7RwPo8u/w/QcuxuF/iA5kgGzyzUucpRAAQQotpZgopaI6pHa/eqSOyD2742n7c+e+0Z7i1RvSs9XN5H/KCF+T0L9bez0zWbEO/eMoyCc3pSY5+OTAGtDtC2y/Qpiz6UzzFi5USdkJviPag+DCEKalmoylsAyl3ljfl1G8A+JvoYXQRPzbhne88DHhuuHgV4qYybXbh21lvS5TdyHIs6GtAhstH1rRhXH4txtaQ5wJK05/ef9/g7qqnl1nNARbM8q61z0yc1n39ZEdUzItVhODxlR9tEEB5U/CGkh+krW4Fd7S+qD4OPgvrF/Cpo+PNnHzanUsk/Mb/qHgyxUXBffJ9ZgOMiG3HDYNctElbXLup3KQtPTky/Nzw04bPa8liuSRIf5cZyDGSOfq1yPJWMOZ5KBqu03ONYEZtNpHrYNpex/L8BftV1H0cbi8+/1nXqqXj/yZ5/tzdSvePfbyraqu6cdvlvHohUxymmy0WKtOKB0ejEqiKwpQ+PKfYjkRfZkZZU0yXnrsFxQV3WY8h2nW/qaY5tKkKsKrRlMWx7JGMfy8DGxVy/05AiobcimJXxl299z3JslM9Q6e0S+U9kHWAd3svGt3oFNVd0DpU1caW/f0agBI5gMdDvSU0/m2Tnu+x7B6wbrAnyOyVafYGo9tPZSdTZOTZ6cK/OLWlnDgls3SGcq1Fr6tBJ33/R3f8UcQ2WtuS0J0Ht1HEFFS2Z+XUkoxTYs45E1FNgVwkOme496rGjHWNjouNibvqP0Mv7r1VY5wZCWdtlTG3Mnxs4YnfKp0+RLe+dy+9DWENDP2AoUX2m4zLv8PNPt0Rwl5w2+Deb8g+Iar8G/lTF9DHGmKua3F+An7VflxZF5s5UXM8NaeFwPKuOBbUXV0zpPJFnUZlzsxZtkQbkXK1M/1G1R7V5zh070rFb2uOJjo256S+CLWNOso+u2RwNfq0v7U61oOm8p/l2jrCGhtiufY/GbuNR1sukJ+HbmajWOVoV7HXzaI2o9s/RWZrjqnk/mV+VozGoni26GoGWxbbp1TVlWricuV4MlWoLXtuVtENnTsbd3MeNu8qcs8kYEV5UiIawzuSm3+isbLosfbFPOp5lnqR6XGfR44bDFxVAc6xTFGv9fwVNdfNmofany03Oc7VNCS0OB0TusbzouGqSHv2Hv9p1tLqH9XBi/gw61K3zz4hqvxzfY+4EFTFNOrD/C+5GHbnlkY6+OHzftVp4SnYC7Fkwurje5kXH2TKAOVfNGDlGQHlf5LHnc/Xl1YBLn9upclwnMe1u2diHnIc1COso1/tFxd/r8h54ETAZYwpqbP/c2GXh/Fz31Ef9ZPH6uen+/POxJDrntpH1cLvW0WMTXfWGIeXsQE+0mt1NQ+MqYlrSxyYI6qAW22cRLFrN8Fr7uZFzZl7P6qW0IuygCxshYzEJ8QoXEVBa5fO9eY3C78PrOdazoJYK17ImBVPlWqIrR4wNW2HNGh7vep+qU3/X8ZhCVEOduLUhrfgSL5ZjcjLyd79QjbX9bAvqlwPtNEVUu+vgnOrOj1wn0CQNDzEdz4KbHSmuf95zLeX+NboCUBbLaRtlk7NU09CPGVQE1D81c+7B52yQHgW1FB/7u2ibRajHjxqMDYQ12I6tjUaW33c4tpZbBZ0AX8DWF7gv173KMYY2wrwt1TW4a19XNrcmB3ydU0S1mwN8poOjSdVV2Tm5RUwjrhu8RFJ75Lx1WWkc4qbtQiaCOqriNxq5ljl3a37flfc2St+ToBZ79I/c1x3L0RNNC5/q2EBYQ5djK9exdd/B250Yd+/7Br98geWB/27KrAufdGutOWbj6EHtdvXZnmtNjneVQv4JUe2GcyPRaVmYvzZ0cP5LqaP1ENfFHz+aZuk3ktIiUesFrRetrRHj3yZKHZ2g3ppzacXJffL1esJKle8uBbWsS9MYr2yspO2+0znSpbBeGoh5nZexNdP51ZZzjoSBrgETS1/gcbvAmIpam+MKsv505Y8+bAncJuR6NKn6zLZseLZP+Ov/K9txjah2w8ndmD9z+OsGTdApdWC16IrTJQaySaREjNinYtzlDpxngeFps4D9PFcUu+3R1MyZOW5H3DVBLU5RV1dEybj4h3Xp59hYq1PX5XnYD5yHBZlf5jU7rS03rP1guotS/yc+R/BJqpSbuSea9duG+ZbPvK+tqr9rhage17kpz04fihaUTktCNWeoWXDLSMnfplmqmOysrYlaR2VvxJG6bPEWKVe1/T7nPP3o4vx0dW1WebZ+xYj4zRbPVQC9dPS2X6iLAXrUrwthndKa0fsCVxYvfao7bqrRa5vCjScdbRquuhLq6udUg1Qf9tjftKLTENVjDWit7N3k7HSZ6o3TAk2MQRlFa1LgpBq15qx1+LTZvX0Iscp3hGuPOACXHb3dXTEmpmz07hVASYfCekWEEXRctU0Fv2KTJmpsRWzW8v+bA8K0le9rfmUIXbQd3xqkqvrQf6SBb11H9vPKSET18E6NOLYiqA9FCqQz35NSB5YGIa8UVjqERK03HaTMQJgLaSeLHjix9tx09Ha33HvbyA7LWi92uItz1rIJyuY6lKngbYuXkaUW5zpwatn3sjm4PDAuM2NXrf6so2h1uk8Et/SZzqrtpu+93G4bRPWwg1kavUkxsrLgS06rQcvFV4yMFM85lJYjY/IrRXGCXkhtU34fsEXe978Iu6yjt7umSOZRNlg2xZOOhPU5NhoqDn+b67YuyXyIdtzYFKjMGgb40hafq62t3ZhfgaSzmjXvofJsDrxfru9X/vukItTzSjumZdv89ePHD4bYMA6t7DAfqrQnBnKOAws9jcOFGrxDBlWcvxlpnUH1vUQpv1q+/B+On3jf/7lpfzd5KagzWtTaD5B+6OI8+3vf/AQ9emCTKfGg94HDn20q7fKtxVt81qh3MN+r+D5/MTL2tu3G2BWp/LuJT6h2bmMp3Duxa3q8trSzd11nVelVh1e77BOR6v4HsFSIXTdwaCSVh+g09IaeiZ2awxETMUZr0sGDwrZS9QuC2vs1aIGgdsL+dhmxzqiDAeovtkkDn9OKUa0Fc0tBfdc0yKJ2zjabpqsNHrGzZS0LqR/Qib3U64/XFUH9MwBV/TeI6n4HsDR23mAQf5TiUpydhgEWYSlkJgLr0FnrMh08pdWCILF8HYLa7zVoYro5D4+gdktYnxnqHEB7IXLC5nlU2NqMrOd/X9LJkYSKnf1PWJvXQJGtH1TqOdlYOK8I6mRbtyGq+3Nm5ubw+WlJ935HVV0YwbkT4/rOHD6TJXdaroiKeI/tQsUVWn6TGbs0vCqfEdS9COu2VcE/UMEZtqoe24CojkOTiK2wiVIfXVOl5ZhMO5oX20Ui5bt/09tuZke021yPT1X13P0uQS28Zaj1MnjFATl0B5x0ypzoNIy4GK/1eIKM133X7Mj/+2mIOGftLWeWr0NU+7sOiePQNu373sUzlyEIa3Vyv7d8q8zYb5hBOKTG7t5hRHVcY8TWxtiwtByTkq7dya1H+h7TrXoOsibKlVuyqZmrjyNP+fskgDTVJzG/b0rLa9J9gVAi1eMI6lvSvcEV507vtf544J+W56yntFpUIKr9XIeq133YIjv8c1qzN9src+u65duc6Zl5iHssbczhGz7qOCHjIfj1YGrsNlifbLOU1L7ZjslFx/NDRPXf5vfouYjlSxXbEoX+ps9X/bvLiqAWMS1HJieHMosR1R06MZIme0BQS8dwHQm4uCiLoXhn9qckioHJO7pPEIazTUmLccHGn5+IU3LW4vViB8ik6t/uZqZd6q6QcjwHTLsr8xDV4a8HNrTdmLUuWNa1TdN6QuK7/h/zupkp2cL7jj8+qm2W209ORbc1WQ9J/+5IUJvDV2WIk5Lo7g2Aiw7eWotE7BvLIqy/FP/OcM4SwNn1qO1Of8paNajDK6LGdhPkRN8jpSmjRoI6XxDVsLUeiE9nk4YtmqWVjyc3hxS//8nCtolNm7X9/TWf6VnfN9tqo4n+57rNZjKR6mEEtex4THFSwANh/azVwQ9FT75QGRzAWZHWpjjZA8Uzh7W5pn2a/U0XVXPB+3Fkm27Lsa6w1wMbso4yldKBX2czdySKnevT6jsjqocR1AkFnsCzBVqcvEPn/W60hgAAuLMmtYlSvxjOUY9hb8WP+DyS8wrhkFu+7oRNmWDXA1t73tXG6srY3XRw5uNRQ0R1v4K6tuw6gAeOngjmfw4YxCuENYAztI1Sp2wAj0Zq2l2zNeNsNaK6xWsR1awHJXddrQOqf5YtPr9XcKa6P0F9p9E+gLHH66Thgvm8fURBz8QkOt5P9ghrw3h3lnWLscOxFb/WpTZOyCNp3+Oh12xJ/9mei+VsNbSx1dOWohzcFNU2dL0OyPvdWLzuXPzPY+/JRlT7R4agBofEsiyGp5WfpwfG5773rP7nS2WRlp/7rmRAWLvtrNu+fGK4VssXZqZdlJqrmcafq5kK6/MWfYiojtvWv1jaAbIcwvIP55bj4KHrjXQdl1Knx6ZgmtizBFEd7kAVQX2JoIaBx11ifl1IPzF2dw4ey8mRvwdhHR4y7lY0gxe0EVMPPkUDAkeE8Tdbmy3ONDczRM2hDfA6JjQd64HpPkpd/Tw2ovpCAki+HEtCVB8vqK8Q1NDzODtVMVM+5x59fBHWU13Y5clJH3aCB0tHa2aIYPpgM2TOtbmXOqUV3UA2N4r+tJ2vgvggiGpAVMe7Hsws14MnOfLXk13btLBrqfGkgCaiuvkgnSOoocfxlaiA8U1E7+Jcnyv9bpKOlpcPInsUbIslnnGu2gvabHwQpXYPcSJto9VeRXagc3IzTCYbhLcepI7aNQnWeFFEE1HdTPCI2NlXPOQeQQ1HjqnTiohuexbSdeS7Xeoj3/1JF/6Vimyq4/fP2uw/tnJogca+uc2spaMDDqHRarGTZy3GA0XnAOLzLcWntNlUeTE9H/VqadfmPqxVXKl1eIBKWl2255884nDCEeNJrj0Rw/U/87pRcxW4oN7FmX7vr9IO0h6SCcJ1ML2St3htmdIPjtqUFjbkkSi1s7RxIPFJAOLEdu4vBwpw2Nq1hQ8+IqJ6v7MiHbja47CIoOYeajg0jqZyHr94nlVIXtIqv3GpGwwisNcI7O7pQDgR9XKXGf0aJOJ72N5bfa63QwBAPL6mzPkry5dnA/kimaVdK68MRFR7jDiidWkKMihmCGqoMW6nKg4l7fa7iTMibeUMVgT2SmsZQDfct3itnNNMacLgRDWV3R1FfYvVSOMCAPzDdo2+G/i8su1mrvP+IKK6XhQtTX3BKBHUCYVAYMe4mWiV+I2Kw3NaxZqfEWyJ8GuknxTkdrQVUDdscjhnb2RO2G7W3bEp7DwZohoAGqwFkt1nG6VOB/64tqL6zHUfBFG9e3BKp33Y808WVMOFrTGT6Fnpfw1R6a450Tb9XrSxXMuwID3cWlS/tHyPLwhrp0hajgdwGD228WT5cipAA8SDbWr0w9ABQt3MvfNkAwBR3VIcyc7/vl2UWz0TAFCKaXF85JoAzkr3jxzH+FQ8G6LXVgtZF7brC6ngzmAbjXzp6z5S6BzrftJKwBAXbDjH54eeGnev0er69565bNcQ1X8iTmddlFGuzsKZhG0xTURgeKrR65zoaWO6Kkx1o2feceDGxXZTKafpvKFNXyGqsQkQPrY3QDyNdfuDRsdt67w4q8MQ1b8LpX3nqLk6CxDTbiL98EVTw6kcfnghu+3o7SQzY000bDRb1OY8NVFqf+Zsm75ibsaH7frHkUZ/SQd+XVfYbvJfuJqliKj+5aDITk/dOWo5hzinqEvcDixi2nkkNVyKw4m4ThHXexeypw7b/JtGrSc07aC0cSpyms8rHkYYI+AntsVR8W/99E3npv6Won28jH2UVaPkj5Yvd/J6LUS1+e88wr7BRWGyiMeGVvP+jpj2Bone3VTENWLv94VMnKd5x28rUet/aW8vRPUTN1d4R25rC5mPUfkrbTZRsAl+YruWLx35/Laf48pF24aofiUz9Wl0dxQmi3aBSnWhuaI1vBbX/2pRM5zLX8JanPTbHt662t5EydwU1WwQ+0ebPsPuYRMQ1WH6qImxD/Y4IapVX9lmzqWIavcGpaR911Vtlo5eMHXjM1RyPlcFAldjhcFVReyRFv66mMmCdNdje1evQMOx7x7bNkVUxyWqE5ovGqz7eqyCVdAKW1F559hx1szydTPX/LmoRXWDtG/OUUc2HvSuaTk3fUaLBCuuOXP9y5Ga9yisjfl1BZpsaKy13Ylgd9e2NuA8+zdPN8b+jnk2ERHVh3ii6bzzVyfGPkqdOvZ1lpb2TYJeTgU+Y49UL019JPKWnbuoDJRMTHFcuGs6fLbPXEftdA4grEvOtd3LCPZSM4XgeHtFmmd82Ear2cSKxyaw0RYPtsL4wbWaGhq8tL3lAFHtiAFKTP1Z2Ufuo45mHEy0qvcnQ6p3rOJ6Hfs91wMK6xJx/uS2ha9F2//Q6uELotiNOW3R14hqP6HfYB9t1jBEtWd+q7Gv9eOqtrH9XCcu+W8xR6qznowT+GOYZIdLdv+p6h03P6/i0uhpErmw/jzSr5cMEdnYKqPYmd45PmF47sS2XR5puuhENesbohpRTV//tP+uZuDqZu+97xsFUYpqrepclybzmeuzgu9/otNQJ67lzuU8VjFX2D7ZaLo29uc3u+oH2YWXO8f/RWR3KqqpERKfqIbwfZp5C1+GK/b86mvJUrJNeV46/vVsP9+ZK0fJ3kQ4ICd7BqQUa0iZtkH3v0w8otOwjwsVc8sYz1vrFReShu1KVHOfyKYIE6IaUQ2x08ZvXdF8XjE3dhsoT65fD6xR9AfLlztxtjrGSPW+4mRU+w5XTEtlbzEoXw3RaWiGnPndxHjeWiIXxSPCWu6yfnHs41VF9v+0qjhFz5pBFlac6x+1CsLt24Vpd1tJRit6xSLwfrb9nBcuHN+LSlRrg9dVd76n2nfQDsXa2Bd2gHiRDZgvmhIenWOqBRvle987/DGlqni16FkeQdEzRBIcAxkdYfo20q9pi7d45LijV/09N3YbKLIxvvThO2o03faKt9Gj1bFFqtM9A27BlA3SCEm/fjfcOw3tkJTw7zGmhGvUWqLA7419atbQfVUtehZiFBuRFBls+sMORIC0ybxb0oRBaJhDrDzLwrUdl5dj112JRlTrDk/dOdolhRqC629J916pcw3QFWVKeHSpxuLUF09S/PGdGfb6rTZUr+565iw2AATk0162eAsJJnGe2p/+Tox9cCj17Otmxv7Y2ajfNaZIdV1DS5oBu3VhGR9JjcxbLjgAdZyoSIuySrikC+r1W/+neD4af65pkn6rnsVecQ4bADz1cdr6rUtqCAWhYQ5x71vQUMdlZvnyqzE3zaMQ1QfOIaQYluD6WgT1Oa0BPSOZL2s9YhAdYjeLZ6kFzf42r3dcP3n0FWTTrRrBThjSAOCBoBYfp03atzdnbOG/Pre9scbXfm7zuUfzyWKJVKc1f//oeol5OMrwyCT8YqjuDcMhY+2TVqCOtniUnrteFM/EvKaH+ySwywj2Nz2DvSA9HAAc9HHELmUd+DgEk/zCViQ++lqLQaPrtsfMRlvDgxfVB6LUFCcLZKGRVFzzenYSYAwkM0IKY6WxN4Smh1cFtk8p4rJWSB0GEdcp4hocWucmtELU/S+bthvTPgtPhBZRar/mve3NNb73c2b5Otl0GuVoVwyR6jon94FqmsEsNNKPF7QGOMBN7FHrHQK7TBGXM9jX5vV6rhfHP7osyjeluHbw83ENTnwgquP1cxLTPuW7hGCSX9j215Pvmbiq0WxvHBll3Q5aVB86S81cDWah4fw0uARR690LpJzBzuR6ruKRCLBc0XVr3I5i/xTXmhaeOPS5bFM3ibzHCZsw/vo5so5860hQfyaY5FXfi72eW748lGwE242BM9WAiOoOqXNqiVL7b2zmHS40AH1A1Hq/yJYrutJKFPsf4+5ZbNmc/RbAPeWMxTjnGudn/fNxprJ+mNeMmS6QtG+i1H6xsPRxX1qIUddsV9bCJxh8vAcrqolSB73YlAXJAFxHotZ5rBXCj3H6i2dVOYst1cQlVfzOMZH9QfsTcQpDk9AEUfg3p+rjfDfdZeGJyOL6QD9FtQ1ZYBtptprtfOgMs5Aj1XWdQJTa7wUnMxQkA78oK4TnFBtqLLI3mio+d1BklxslYzqptmsYmwHx8UQTeCOmxW/d9ODjzHy7q5jx8DMwaJuJGVohupWxr8OSDvlB3wQ6GBNDlDrEBUccyStaAzylvNeaiEF3Inusomfi7Hwd48xWB58b/CSxfB1iynF/VYMF/zOvqd5dz9FrAkleYqtV7kLbQNGou+1GwcWQwYy3gQ7GupSJJ4yLn4LaUJAMwqAUYxJxXXDW0V5km9czY1npmJrX9MZkYDvxpfjdZoQqq9aFp6StWAe9xPYsPzbGQSGt9kqesx5/1bXvFaAjHR9txkWo/S3fy7a+QGrsC74dxZsAB+Ok+HG5p2HBr/6cIqghQCTjgiJm3YnsXM9jS3tKFHvIu7G/DB2xbrkZM2HEeIntGkjl73F9mFONRsu996vikbkrRVY/IKihBtuz1MEeb9WN9Dtbf2uoaPXbiAbjEwbGW0FNyiKEiDhUcvUWzk/3i6+kii11IZVd/7npd2NujIj1o+V3YiPHz7XQlg0t2GvfiI0pHfZTnV/lz0nPwhlBHd54SszrUTEbQu9zWddtj4CKD5Aiqu0aLsbBhqAG8BMRZBtScgcR2AtdI04C6McNojoakohFtZyJ/MEQaITUl5DjHWQn+IttlDr4wKGM68IWPFhuOiykqn7fR+6CSv8+UC1vyVxFUAM04KHm6ZM5zd6/wNZ7WkVcS5GzPqoirwa8x9rWcb5gNHjHtMW4z2m+aNatCYLaa99X1qZLy5fHonFsv6foid6vNg0tUl3nmN5REMgbozLXSYOghr4cj40+4nyIXdgcWy2zkvK3ne43Zew6L66lzzM536iL7KLDPpP3ycwwd8KKWLIq3EKxMu9ILF/3SNNFwW0xn1OawXts+/DFRJKNW4xz2biWDXGbYxVz03MKeDCiWp3cuh34jLnqjaD+QktARzyp8JBn3eUOvorwUoivagR3ok8Tob2iu0YR16leZ5OZ7iK4lwOJ1jbjeWbs77qG4X2bsxHGCLiPbBIviE4HMc9lY972vPAyssBhaqkVzkRn9JkmH1Kkmmu0ENQQNy8qFESg5mPd1VgR3HllfE8rIns7veuz7L7SfaOJa+krqc4ra8inDhf9pO9NgRY79gk97w1tsh7wfcJd6xYUIwuKNqnJsY0D8ZdsM1rTPtsrpDPVdQsPZ6kR1BC2cyHXLPxTOBinxTMTR2MsQb1HAEmkfKmf76/ir97r87ee84Xx+0jWinc6ptpyoVVc+8ZWNJ0PdcUItCYZYXyAu+vdrXk9O42gDscHPm0hqu9c83cGWKufW2i7sz7X5reBDMh9F6VjeBDUEB4POrdXPqY9kT3jbL+sVWxK/7S9gmsxgKiR97dNGZwZNp19cLZtCxc9xeZsB8yTztWM+kBBIrbYtq5HrDZcvveN5WtT01O21tuABuQu7jFACGoIhrIYxxJnEXoU1s+6k91WWMvZ6tOe16BVCxs6R1R769s0Iaf5vOdehTTHg8ImbSMui3UmZp/QZjNCMsmmfdQiCF1UY4gQ1OA/T7rorNgkg4GF9ca0qwwua1PW8+d8tBT/5305FtAZbY6G4P/4KxTK9W5Dc0ThC5+1eAuuSLS3rfOu3/RNAAOyLm3ihTMnCGrwGhEL18U8nug5aQQ1DCqsTfursYa4WqvNOsd5fnfXSSluaJsp8UJ002tyBHVU4g6G56qPuiIhFCojSu2fo4Cghn1IZPp94VRM2RiDkYV1bl4L4dmSDPAx26x1Mz23C2E52/g//lLedQ/h+8OyPpzTEqORIqoR1b4L6pyWgD1iuoxMM04ghIX3pO8q2xrRemzhwBMpcW+tbHNnLf7P+DzoY4sczaDeAWsL9Kwfu95U9vpMte7y1KV+s6i4KahPaA3Ynq+yuOiVRgBOIaK1sF93LUSO2L5Nzx8zM/Z3bC/Eged4hVO02egIzf95NI5v/NRtAhfzSkSTbYXiD8XrV2wwB+sTTwznocem3FROEdW6y1Dz9whqt4zHqTp9CGrY5rMKahx6cJlVS1Hd95rURlR37lhA6/Vy0XIshMSzr8Ky+Nyp1v2xTfHNtJgg62N4YG/doNO1z/f07zpRnTNOnHIQcsO5EfgdSY17VzgLCxwG8MA5FlH8Yvny0wE+n8yhNme/F5ytdsrJa7MBTcaPe36qre2QqtAZTRicXzwx7Y53QHecaPHkuEW1Dsq6MvREqt1hiaCGCuJcfCxEQMJVPuAZtuN1OtDna+N8c7baHb/mpsVbPFA12i20P9rMrcsunX5wAvrTLdLoRbWpj1I/EPlyxkEQJ4/dOCi5L54JZ6fBU3LHnXf5fG2KI930XVQNDtLWNqY0oZNzM9P1z3pcMDeD8YvbHu+A7jnTYxpRi+qk5u+JUrthOOYIalAkOv1P4VjM+tjwEmdDC+EBIMrakdGEo62Z4tNctniLJ4paOY34RE+Wrz3Btw2Gtsc7oL9+QVTvgEVlfOdAdny4ixqEMjq96mGcnUp11OKP/xbP9+LPG8Q19Ijza4vOs6cWb3HR1Y49HGfLTPsNjZSWdHpuPpt2ab/nWk0c/GZOEzjJhW5stsLL6t8HrtLinOa4fTM1RDvgNTq90LS3vpCdxWpkR2osiKiY0PwQMTIvvrZ4fVlxeENTDkZq6mvENOGpZ1sL3QjrvJhbt8b+3Lwc0cjJSPDWP563mOfXzPHG+vBbi7Wz1dzyNVJdt5tAesy4g3liuIsaXu8VnQ6wAOyyA2dEqyFyx13WwTZnq8V+47wN6wR+aPk2c1rSm/mZ6hppS0alfm9JLV/Hplnz+ZW3WP8u29YuCE1U5wyp0RwDMfIrBHX03BZGbago1/OR9gGgDT45smnL11+QajroutmGByKX3jE3XLMV21xPjH2UmuKux9FmfrRa93wV1VNEtXOIY8DVWfEiDsJ73YUfihxRDQ6sO86hIuuu5dvcdHHGDA6um203oqkk7Bl6TLHNWsk1W/5h298vhk2UY+eXtJdtbZGrNpkg3olqTe3ctQg9cQZstD6RAXxBS0SLpNpMRoiW5L6LH/AK24V2rDofqbGPhv0n+jhO4fS6+Zk6Mt46/hJ95JqtOOb6tMVcz7gm2G5+tHit9Ualj5HqxDHHJXZjIYOPq7PiRZy6ZAyjv8eZPMPZgAHXnkOM4hDpJnPa8m1+nq/mDGfn6+a8g3XzyVDx23dkHLy0mJvUEfKDNtkkpH7bkbWYWwvbNc9HUU3qt1uOwSdaIkrKu6fHTj18ONJOANjYOllgbY+3jLY2aTTsoeXbyPfOEdadrptdXDm5IILlN9p/ba6w45ot9+f7xNhvoN2RgdtqbtluSJzYzsuQRDWR6mENxdSwgxYrUrk06ePu6Q4FC6IauqSN4zv22iQirm0aOMLaLUF974j9hfbOv6xhn1u8BbUP3CZt8dqM5mtFNnS/+Siqz/cYJhhOUEt7U+k7Pu5VULuyiVX3OXAy/py3k+JhI8xemNrwNHY0saM0cIS1O4L6yXCFVmjCWjK+uGYrvDkvfWK7IUtV/27WPtuCnWc2xQDfeDZA6xzlR4bPoEYiQ1BHiZyfnjmWclgnqolU/4kIqw9SIAkH7LjNCGNfZMaJaGIHRZEQ1m4IamFG2neQyBjhmq2wWLTwldkA74ZBC5b5Fqkm9Xt8csPVWTFy7cD56V1iYVPjiJzg+P8hDMtzXVcIo8EW5dwxp/2pg/cR+7+mKnjjubfoUFB/pNp3mHDNVrCi2oYnjnd0Oq9s64qcH3u0wjdRPUFUj+ocZAjq6BDB+k7v/XMVotWHSXcIow3C6KDNkwX10nbuuOQYVYoivXTwdhIZk42ZGaPk4JrZVTHPO804gHAFANdshTP358Y+Sp3Sgr36P729lkg1NDUQMrC4Oisu5FjF1IPICOeq98/dSc3clQX/u0bS4M92K4+62JK59p10Ls87ejsZP1+pPrx7zhXPusM1U2wx8zQOZH62uWYrowm9FnLS90Spu133cmOfpXVxzEYVohqaOAhi5G9oiaiQdJnEk+sc6j4j6c3NFvdPxRzPiXDsFMVnLV7vZFRRo+fXHb7lDePnt/Vypj5JV1ldL2qLOUcdhwB4Nu02vi7Y6HLCBtiuHUvm+ih+UCevfePRIBUHeVcqxQsDsNd2T0x358HADyTN0CcnjvTv+vkrQqdJtEwKca2JWv/XbiKoL1u8xYPLG1J6nOOuw7eMfvyIj1I8smHx1XRXyBNBHaewlnHU9potjvaMRxs7yBGP/tY82wyQq6abxj5FqolSD+8kSJuThhIXt4XxmXv2mRHV9aRH/FsRAhK13sR876kK6qsB230sJ2PesbAux08em0Ov2Vwb024jpk5Q4+PEa7vb3GyzohjlKLZA1k7b2yLu2EDrlTYbFo38Yp9E9QRRPahhEGOcG67Oigmp8J369qH3LEInkc/hiaU4lLS1byqOksjarAtBfe/L/aI9CGujDuX3GK5uk/kh88S8ZnN1aW8Q1JHTQRr4mSHqOQZtotQpzde7qLaNVi+arGchiGp2dRDU0N6Bu3a8wvchHmrGcszR6rYL9EUs4rrDwlIvxrOCUj0Ja6NtKVkPaWjiWseLZHF9M/ZRKQQ1HJqbMgY+tpmDVOgf1i4Y+2yVB09q2Pg8n0Qv2mbfnjRZ20MQ1TlDpXNEXHF1VjyCOvFcUAt1m2tRpr+pCO6q8nBVXM8DbCv5Tl0Vllr66BipsP7cw1uLI3JTEdcT3+eViul/Tbep3ghqqJubEl17aPEWGUUEByMd6bUwTDsf9H9CENXQrdOQ9eQsgLuCOgQHjnPVf24yvHT8niKuvxQ24rl4loEIpNx0l7r76OPxiYrzLrvw1z29fSmu/9W08MSjcSIFyOaayfCtx/XxCUENNbS5X55rtgayE8Z+I/vRlyNDvqOb3rZ3wZ8dCix4L6oZiJ0ahdRwF3UsPEbiwEUZqdZ+TXoQ1qWT9kEF0s+Kzz4J7IqY7jJ190UdX9/HjTjf//Q0bkpkjfmmBfGWrh7RkLRZ3WQWJ0w2XvrM3hJ7PEVQQ8285Jot96Hitz+0ae+98+ivHz9++OII/agxNn8xPjpp37nh6qzYBPVzQOM3UZG0zZ2H1cy7bBcRLLkZpj6CjCtJjV25Jg5U9M/U8Tnr4Ve8D2mDV8dNZoY7BvRUGTv5SN/5VMdIoj+HqikShY1SUXdj8VI5a5qwbP9sQxEDH1q8xTsfNm72rOdNNiD+Gsl2bCxtxlPxmSeM7sH7rM2Rr9r1/m0A4gC6MWAIagR1iES9WIkDpYIyH0Agnesjd6S+6O+UZz20UFInJ6k8fX7369AypnTcSLuJEz9E9tKZioUPxe/9KaTM65GOtY6fdQ9jRL7ftPIMXUfkZ1G7AOpZwHCkLe2ZXLM15dqmzmmzCcf8H4dlC91TzkM/RfWe81cYhvZty13UCOoQ2NC9tQLpeWCBZNTBuNTHqFB61H4qxdKzCibr8ajiWWzY6ZZAOhvoe16HKorKlFNNlV+aYW+DuDCV1PzK+HmujB2z9eddTMyvjbXyz1Mz/s0W8l3mpHuDhS2fF3/8bvkW5TVbc1qz880OG14Mqd9jzaVMs2dsfIUL3Zxaeymq94CobieoxcHIDVdnxcC9OnFBzhkpPqGO9y6nmgXkl0CSDbRspDlfRrIvt+xQ+cemFW5PjRu3E1zHEGVU5yPXcXMx4kc5rwhun7n1uaAdjD4fJYvk1til0gtyzZYcsyCY0o0fPTf2m7grsgZGRTY0Plm+Vo6Szbf/0pdCZXXFhtjltTcE0qYrBHUUyJm9WaTG+4zu/80hW+lGw72DH++i4TO2oJbowruY0nZl00rPtX40/RYxC5lHHTcIamg7H2UMcc2WG7QpUIYtGJesxXp2tWsO+SKqp/R954I6N9xFHYugnkfyXXH2mzlkz7LJUvzxvXktEAXHCaNoqzTrnbniSNwxFI6ySx+LtqO6N3TJ3HDN1ti+dNLCj77T651gRF+o5TxIfRXV0C0ZghpBHSA4rMctKLlWHb1GXDfiVoXRJvJx86x25Z1pFy2LwgYXz0Q3IwC6nIcbwzVbY9Om/TKazwna2OaZBimDEdU54+E49N7NS1oCQR3RmCfTZb9zlqm4/oi43okIR9J2/xw3a00Jf4+43imm/xYbzJlJ6HEOrky7rJEb1kdrv0LWTNv6Dg+h3Rjh8RzatJhDkvGx8FFUn9L1nQnqK1oCQR0Z2I9mi8uyErnmusLXDQYpRpaQtrt33OSI69/E9DsV0xtGBwzAwrTbDF1tR9ugEWmL12Y0n1MsW84/70Q1O2ntBfUCQY2gBmggkiRyPVWRFOPZ2VJMT7hD2Fpc30f01V/M75FpNmBgyHknmRCzFm9xZrjW6Vh/etLCn35iXXFuDonNtt0QPtEK8F6JamhnAKTDP9ESCGqAI0WSjKf/Y+KIXj8ipjsbN+Lk/108cvXPU8jjxbyemSYyDWOLgtsWbyGVjGe0ZGPa+Fkpzeckyy76FFEdh6D+QksgqCMgZxj04rA9V6LXIpTk7HUoab5llPG9FiFDTHc3buQarlSPFJRZD75X6JcNgs/mNcV7qvOCM9PgwnxLTftrtkgDP+xTSxvZXqMl9o/7wd2cPytjvwF8Vm5KvfW8HTYMBQQ1IKhhOKFkXnd0l+pcyEKS6OPLneClY7PShRT6Hze50U0vvYZmpo8PY+axMl5I7QaXET9AxuiJxWtPdJwnNONeFpbtKyzZhHOatIVmknGx8lpUk261V1BPEdQIaoAe7W95x2OmNmeiDtlUf7pybd+LCrqfD8LIGYG9qIyZcty4MGYeVJiU4wUnGLzxiTWY8tXyLeSarQVXwO2ljb+V0XxOzx/J1pCxf2I5d5K3NGOwgjqnJRDUAEM6dNtOg9oieSb6U6LbFz19hBcVQxt9xAZu2Hz1YsxklTGTbI0Z+dlHRFsi0M/lOJGxw4ZLr9j6JMzf4+aUVPP+aOxvvXAhBVz6/Na1ttVNQFthzFrkB3PTojj2Xz9+/PBBJOa7HLFigP5F/9cK6hNaA0Ed2dhPix83O/7Xe+6EdNZWlQ7cRB8bB31NNDGK8XJacXZOj3R88orfgC0AAIDOIVKNoAYENcDgEBWEI8fLs/l9M4Xz8AAA4AxU/0ZQA4IaAAAAAAAQ1QhqBDWCOnK4DgQAAAAAENVHisnonWgEdTTcI6gPMqUJAAAAAABRjRONoIZtpEotghoAAAAAAFENCGqwENQJ1Y0BAAAAABDVgKAGBPUYbGgCAAAAAIhdVOMUI6hj46V4Zgjq9hRtiP0AAAAAAEQ1XYWgjkxQJ4jBo7mgCQAAAAAAUX0cCYIaAhXUa5oCAAAAAABRDQhqOI4FgrpTHmkCAAAAAEBUR5z+XQjqGYI6Gq4LQZ3RDFbzpO56Pc6kAwAAAECvvPVcVAd9T3UhFObFjy8M0yi4RVC34pQmAAAAAIAtLTUf4Fdlbz1vq9PABwGCOg7uCkGd0gy92AJS6QEAAADiZGKGKWSb+5L+vY5JVCOoo+K+ENRzmqE1pH8DAAAAwCh4Iar33NV7HqCgXiCoo0GKaCGo+2VDEwAAAABAn/iU/i1XDQVdrKsQ1Fnx44phGY2gTvZsGMFxJIhqAAAAABgDn67UWtcI0QRBDZ4hG0RzBPUgIKoBAAAAoFd8ilQHKUAKMS3nwpcI6qgEdcJd1J2zswhF0c6IagAAAABAVCsiQi53/H1iXu9x9lVQy2c/ZyhGwwJB3cs82sVTxG2SFj9uenr798UYzgNvvx8D/aqHoi0TZjEAAIDf+JT+van5ey8rgCOoo+Sau6h7YXqkzYB2rAr7NaUZAAAAAMIR1d45d+qQbhDUUXGHoB5cVJMR0A9SMDLbkyEAAAAAgKh2lHUIoloLq+Um8Erm8BvcRd0vk5q/39A0vSEbghnNAAAAAOCRqNZKyS87/teJLxGT4nOKsPqGoI4K7qLuHyLV43BZ2LQlzQAAAACIar/wNlqthYO+MOSiQgplcRc1ojpkPuhmIQAAAACi2nNRnTgspk/1DuobhltUSFbFDEHd+/yamN2ZHy+0/WAsKVwGAAAAMfPWs89bJ6onrgpqQ4XvWJlxddYgEKUeH9nUyGWDg40MgMb+wdwMczQoo0gmAACiepvNkY71mAvm1FCQLFauQ7/H1wNRTfuPI6w57gDQjEnxXAzwe7CFAAAD4FX69x6hcu5SsTLdgUZQx8lnogKDktT8PZHq4ZGMHAqXAQAAAKLaAx5r/t6JaLVWw/2CoI4SuYt6QTMMCunfbnFV2EDmAAAAACCqHSev+ftkZDEtBcnks31gWEXJI3dRDz7nRFDXFSnb0EKj8anomxnNAAAAAIhqd3GuArg69/K5LhhScQpq43AF+oDhPLW7ZFQEBwAAAES1u9Q5zKMIWk11/F48ZwynKJGrs+YUZxqFBFHtLCcqrE9pCgAAAEBUO4amdT7VCNxkQDEt6d6r4o+fGEZxCzuuznJOVNMfbiCFy1Y0AwAAACCq3SQf85dX0r0vGUJRc42gHm0OTkxNdgjXmTnFhRZvBAAAAEBUeyCqX8wAEarCQUwN6d5gzC1XZ41KXSGsB5rGOT7oNYMAAAAAiGpXUDHzeUtQz/o81yqRMa3ufcOwiR65OiulGUYlqfl70o3d5AuFywAAAABR7Z6wXhTPX8Uf/y5+nvaZ8qnFyKjuDcIDV2c5LapzmsZZcgqXAQAAAKLaTXG96VFMl9FpKUZ2wnCJHrk6i/t3R0YLEtbdT80Zd3c5QVgDAAAAojoux53oNPwm2EzPRwygMXUbG6R+u49UBKdwGQAAACCqAxfTRKdhl6BO+syKgE5EdU7TeMGVbloCAAAAIKoDE9OnWtn7X0N0Gn5nTlqxM/N0Yuor7xOp9odPRV9ylAIAAAAQ1QE56nPzmupNZW/YRu6iRqy5Q+1VWqTme0dGRXAAAABAVPsvphNN9f5iuHca/oS7qN1jXvP3bHz4x4kKawqXAQAAgNe8jVRMT4ofafFcMQSgBu6idnPeniOqg+Jc+y6hKYKYo9V+bNqnkmFSHq/ZULsCAAa2W5IxdarPdvZU3ueVvdhdRDViGmIQ1HOawTnqUr8fWRC85qKwzcuiDyle5o8DKs9EHThxRM87fH/58SSOnnktPig/19S1CHpMJUP8HlfFUUXU9c26j2NSQ3z+LvpOs6KmarcStWFNslRzR8bIRD9/2d4XHb5/1e6uywe7i6hGTEMbHhDUzlInujKaxns+FHZ6zXEL59bO04oDOjXDFfE80+ei8lle1LmVZ8VGWlB8G2pIO/r9lwPNrfc9CcQhPr9V36n/P9PHiyLEFbtbbgCMaXflxz12F1Fd7n6KI35JV0MDHk19NBTGnctTQ9Xv0Pmiwpqd8fHn2lyduXOHPtqJruXySPV4sdeZC46eZaR1MtDHm/QUCX5mroLDdmyudswXIT1V/zNx8DNX7e6T2t0MgR2BqNYdnpmK6XO6GI4Q1AkVpJ1lXtdvGPagyCWywDwcxaFb6Np54snHlvX9kzp6d+rk5SN9lm8Ot9OV6SdL78FQCwHc8/8X+px48HnLDUyxu74US5bPKTcl3RSfX2xA6vqZc0R1PE4BIKihnahe0jRBcaLCmvnY/5o50Xk1N/7ffvFTOOLkAURrz+bqD5w4/jlP1eYuArC7ElH/ptHrBdfPqqiuHN6XRdab9DtPd3kAQQ3HL5Z1CyWp3+Fxrs7RnKbobd1cmDBrjJROnojrOVksAFHYs8w4nplaqe0UYuBP9NdXtbuLmI+FvNUBmVc7WQuCrPTvc1cWpsrh/fLcAUIaENThUyeu7ui7YLnS89VkInS3fibq1F1E8HXlO661qnxK7wMEadPEN3A6Oh1ZoWSxu9+L7/w51ts83qp43h6QJ6ZyDqdSdXNd/hzCmdXBWC1/zxlp6AqpZjhHlDm/aE72iICMFgoaOSu7IaWskzmURSKmt/2YG91MmGHrAYKya5nLQjXyW4c+qN2dxxa1FlHdJNpbrbp5UxHa5V1mz5WfR1WE3HHp+kSfC8wG9AT3UPtD3W7nE+cmoyDT89VUGT7eqSuL9txE3hTiS2wYRwDB2LWVyxqh+Iyp8aRYWo9IEFTqo8xj2hhvU6jsRAf1xY4BtevfP6hopogYIKih6eJZ11ekBcfBSUVYE2lsPncS8xqd5ojUr3EkaYnX3IUO4DW5cTRr1Zfz3QPb3a8x2d03KnaH4AJBDQhqOIJ9BT1wjONBHBRSwJs7drIZ9Q1BvZMveg4TAPyzba4L1twgqKO2u2/UcX2gzwFBDY6R7ulLopZxcSFFp2iGw+jcuKMlcPAAAhLU4g+4fj6ZNSpyu/tGFuDiSYo/f6TPIVCuEdTeLaDSX2csXFDhA2KoMeKAvtAM9c6vpmoCgB/4UBtiid09KKxnQYvq8g96dcm74nmi3yEwQZ3RDN5RJ54eKDYU/aKMGDqAXoPJ5lM9cqxkpanyAABd2F3JElrQEnvJtDJ62KJaB4Q4q+KwfKbfwXNkt/AfBLV/aJGlusqeCAXIEUONIGqyH8mEYX0AgC6FtdgUgpP1/NzQjEJU64B41ku7/2FBBo8FdcL9tt6S1vz9E30KuigjrA87d8+GTahDXIaejggAzvgw8Mp5YXeDjOi/2bMgi/M6KZ57+h884rF4pqQI+8mBKDULFfy3KCMYG0G0ukEbsUEDAF1BtLoRaYhp4G8ODAyJWssu7kcWZvAAqWKf6HlC8NTQ1vz9E6n8sMWVVoSFPWu4YfPhEJIGzjlIABjCl4FXTkJsozcNF2ZZlKeGq7fAXeSapYSrlvyFKDVYcEP67kGIVh9mQbQaALqCaHUjrkKLVr85YoBsKldvsUCDS3zkyqwgqBPORKlhHxkVwfeu3USrDyNRE6LVADCETwOBttFbiwVazh/JeWtxci8YDzAisrkzp3iV/+j9w0Sp/eSueK5GFkRyPdKUTJValioaT3p4b8lg22w9+0iKR6LCU8d8iDm2BgC6QoIBekTpzDG7O+1pLbBhJllCoazdby0HinReotXbUoc6B+LhUQU1BcnCoM6ZJUrtPtI/siB+GPEziNOyUscB/lyzn9W5+9TyrV60nfPiWVva37z6H3rsY6aidkxf4kyOErBJCwAd+zZfOrC7efl0ZHenanNnPYn+ppzoZwjCz3vb5sUatc60MS6ZOzAQ9yqoiUoFgG7OnR0ptsEt0bbQs1FjrgMXsh5xFGTver2wcKCeVEhnfWxiFu9ZOosLzVhJR3TyZsbuDlWbejOTgb6n9N+mh/dlQxvgsH3LDmTi7RPSoq1WaiO7/lwyfxeO2N0FovpXx4iwmWmxmKUZd8cDwue2GHMIrXAE9akhSh0KcxVH5yN+Bil8kjNuapG51jRqcqdCOh/qw6kDulIn62YkUW3zuRML25cO9B0z1kyAV5/CvG4GybMxv282yZ8nW/9+arrZPJL5963hv5UNuuWQGTO6Xma66fpphH6Re6snIdzc87bDTpEzbbkOng/MXegY2bWbDengwWBO/skekQaeoCnGpbAeM433S/E51hwNqRWtMufODojpdCwHRzfqU/UnVgOPpRNSwAGCQo4KimhcNbBp2/+/E39T/NbCrohYvnDV7urnXKrdHWMNT0wA0eo3HXeI3GstOx3vDNdvQXfIWJogqMNCz/TUbcA90N9eijYRsi5ccZWHdlVHh6R7nLq/JX3ehYiBzn9xtIa+bSRhiAB4jxwTfF/YESlguXTApqV7PqdLdnc9kt0N4mrMN311CtdvQUfccv90sOy75ofrbfwV1rna/jEpK4Jz9/Cf/ZOZ3+9PfVTnc+5a+p06eHNENQA0pLRnTmU26mepBhufKp/TRbs7tB0Mwu6+6bljxGmeFM9n5jkcSWlwUpoiPPTsTl0q1GdSd70XbmL770b+GHK2m/uZd5NW5trU5awQTcX+PPC4AQD/uHXcnpV2V9ZG1+2u+GBDbo6fhJBd9maAjiElHI7l3nWDA60E9cTUp0K9GCp+hyKs5+Y1ajAmV3qGGH7vm6z48Y+uzb5sAgyW9abXfAGAP1y7HoRRn7bMCnI++1I3x58G/JVTRHXzzilTwv8ZuJPAH17U0ZuR7h00YqjrimAs6PugSByw9zd6OwX8viavPPqsz2bYrIMJIwTAG975cuODh8GiFFHtoKiuLuTFIwvWreG8NfxCotMTqq6GjYqburuMH7gKKTjh9vPKRQdsfaaF8cBfENUAsM01x8V6XcOzAddvRHWLjkoN562B6HRMglqKRu0TzXNaKchFWRyesdOMKVzm/ziS9eEe5w4AlM9sxA/CUMEu79fnN2P+8sp567/N+EVtYHiITsdnmOvSvm9dq4AJndp6cXxuR/4YZwM6B9APOc4dABQ8eVQTAlHdDCLVHTlcGy1qQzGzSIyh+XWVANHpCDhQ7fuRKu9RCGvp4/uRP8ZFMRYzesNbhkrznNDUAE4zpwmCs7sniOpuna6ymNl7xHWwSLSKyt5xCWrZfUxZHEH72oWK4Iw5nLt9nNHUAM7ygA85qDbb0AoeiupKB+aI6/CMYPH8LdEqotNRCeryHPW+tG+KjMSzOLtSuOwLhcu8HT8AEDdLmmBwBtkM9/2u6jcufzjEdRCUqd4Ju13RLn7ndUaatO8ohZHYgcSBj5L7voADAMTmU1KHZxSG2tD0ek1+64kTlosTpg6QOOFXjG8vxHRKZcZ40RTburkqkUruDo5XWK+L8XFd/PHLiB+jrAieEAG1mt+J/lGyUYj6A8AQRC2oNcOqLKSYDPirJwy9QER1xRHbFD/mxaASYS2Fj+YmgIPtgSFiSaKTSxzV6A3/PsG0IHMhemGdqTAbc5P0XO3VnB7ZK56n+kz0J+suAIxBHpndnVTsL3YXUd2buF6ouJ6rwKawCGIa3FgMZBd1327yHRkMoLZ8rhlIFyN+DClctuEown/zV5w3ySJJRu4XAIDtNSPISDV2F1HtwuR6LoVcMSBnKq4ZjIhpGJfc1G9yPeo8BSgR2702426M3hRryDrWs3rq0M21L9igBgAXeQzpy+iG8gK7i6h2UWCLM7SqDFJxEEiV6A/OTMOuRULGQ11hMtmAmbP5Alu2+1k3RfORbXam56vXEc1XNqMBwBeCsM2a2i1295IuRVS77qBtdLAutFDSjIHbKVKFfUn1RdixUMi823c+ds71WVBjt9dqr7+O+DHKwmXTCOaqOHUpYhoAPGLjud2VtWWJ3UVU++qoZeY1+jBRcS1O2zndfjQSYcxUTG9oDtixWMjc+rTnn9yyEQMH7LUI2tvijzcjfgxJwVsFPE/Le+PZaAYARPVwdjctng90IaI6BGdNJmJ59npifp0dQ2Dv514cTFK84cCCkZj9lb7vKAIFDW11qjZ6zIrgF4HOU4mS5IZjUQCAqB7S7mboDUR1yAJbHPyUCPZOHtUArIhKQ8MFY3VgPFGYDI5BxssUm9zpPJU17gstAQAwmN2dqT/NRiaiOhqBXY1gJ+ZXSfuYJsGDCiOENBwrqPM9c0WODSQUJoMj7fKzZj9scEYQ1AAA2F1AVPsnsDN9Qr8z7knFUK5CGtEDCGpwUVh/pzVw7AACZ0oTYHcBUR2yUydVitdbIiJR4yc/fbpTriqic6LR0LOgNiqoqfQNrWxwMdaucU6s5+mMtgPwAjJywvKPsLuIajhSZGdm3GI6dTzq59yo8FkTLYSBBfU1gho6sruZjjmqph43TydGs64AAGAQuytVvrnlBFENFs7evJhApoGw/mx+pfbIhGtTfOelIuw3+jyXIpoINDgiqHHmoUtbu9Cxx92ezckM0S+AP9Yw1zZ89ZgLhGN3z2gGRDX0J6wlBW9WZ8jVWTyteS1RZkBQA7zaURl/VAQ/PFfnhg0IgF2cOviZJnRLEHY3KX5c0hKIauhXWMuuVS4TbpewJk0WENQAB+3ss4rFQ+MQXq+MdAE5itTHpjAbBhCSqKZIGXa3S6SG0qanccrai6h2QljLQPwuRXcQHuCZoBYhs0RQgwN2dq3Ft77RGnvn6xjph3I0Sc4S5uY1w2rd43f8QU9DC2GwcvAzgd92NzHjbPYNaXdzw4YmotohYS18kQIyxb9NaTHwxEE/VMUSQQ1D2lnJ+vlY/PETrbGTxcC/T6IiKTYAOhAHQ0TBnBKwWtgKoYLdtbK7hitxneMNTdCtsC5+3B74ZzeFIV2pMQVwVVBnCGpw1M5K5sQdLfHHnJ2YYc+c3xZ9McEGQAcMdQzOtajwjK733u6KLz/kWeqfxY/F7iKoEdUxOHypiI0D/0wmYK5nVQGcWiBk08ccrmqPoIYx7ezcvJ7ZhXEc9GsyrsBDznTzCVENXZEMbHcXiGlEdWwOn4iN9+Y1pamOcxXWGFVwRVCXBcn27brKmH6PoAZHnJkXmmFw5+6W+Q8e44TPpeKeatGMp6bcYXcR1TEL61ydnKc9/0zOEH0tjOuSFoORF/gmVxaJgEl0bAOMbWOfEdaDi+onItTQA0OuKXNHvjPzKAyGyDiVNW5BUyOqY3f61jrhDqUpfihEzdqxtCSIR1DLps5Xs79QjIzhKVfAgYM2dsEc/nmub4hCT2wAg++ca7XmMeer+IVXdEUY42mA38H5aUQ1qNP3XDxiQO8aTMy1VlwGGGJhn+g1CR8O/NMH8xqh3tBq4KCNzczhApGhM1R9jpwRx9gIYFylI39fNqcC8aEG+lUrWhtRDb87fiKWDxUwk0jDF6qDwwCLgaR7S5Tv0HUeco4nYZcUHLev4iTf0xK9tzOZKt2xGej3+OBLDL2+XIwVrS5+b2q4RisUhhLVLthdNAmi2jmHJCt+vDP7z1kLUrxiQxEz6GFBP22Y7i1c62YQgA/IWI21IngSw5cMbE0cSlQ7L+BG2qzJhg5eaCbiDaYajpwfowY1RriuEVENRy0eko51KKpSFjEjag1dGUZxvGX8HUr3lk2fd1SaBA8dDxFdFC4LF4r12Nl+H1LAHwb+fWdmwLRzFdRfGI3gISlNgKh22vkrHnH+PjZwAMuo9ZyWA8vFvIxOf1NHYh+y2UNBMvDVtm4Md7+GascSE1ba7JDRJx82I8ZYc6RoWd534ELXXwQ12I6fyYi/m6J6iGpvHEAxtOIoHEpZLM9a51QIBwtHtEl0Wvgomz2cnwbP7WpuDtevAHt7MsbvFdGTBTZOhxSRVx74DvlIv1c2avI+ovnynnKzS8P1F6COMTNNKKqHqPZrYdXq4J8bGv9/ZdeTlHA4sJhLZW+pGNkkOl2me2M8IRS7KgLsLqKvPJQgGSsLYNnAjvnI04C/K2MM1yLnRb9LEbEufCtdf6W9vxvOooKndpeieohqn51ASc9633CRlV1PUsJhnyGU3fHLBv9cNnNI94YQbarYxwdaolPmIxR3krUx1PTDzYC/60KFXheCsfOsOc2QGruCvxQR+5+0kxTFO2asa7vMdTP7X0PKbAwMNX8HzzShqJ4db2kCp5zAMgVp0WAwlynhIqDmmvIIcYtp2c1sGtF50XHD/YcQMuXVcWeBf8+hNsVk3cnMQJETXd9Cduxk3R4yElQ653OtP3BMX5yqb7LQcVD+uUtkPbp0oF+uSlFcfO9HFU+75pi0ifhskwhsDPzps0twa6hfJ3Y3GVBQUwMAUR3EJJXd2lR3O2USHUodEkP+rfj3EpFJEddRimkxtOkRzpmkxS44Ow0x2FPdbMrN4SvkfP+eLwN9x0uJHvd5XKRyhvoy8CE6RoaQrBNrjVpn+7KUtB9kfZnpUx1f855EtWvO/Lk+oY9FsOPRDJPi/zPTpO9rTrWoHjUAENXBOUk/r97S1Le0gbN0gbiOTkxPdGw0TTOTowVkNUB0tlR33r8G/lXzAR3/T5JV1YeDp30ldi2GyN9YtvhEHecPuhmzS1hPDvTBiWxYdZntpJtDd4bUafBrDg91bv5KN7rmXQdFNDiTGTIuWsGZavcdwqUubk2L7pTiOh+rUiv0L6Y1ynDMua1b83p2GkENMdrRlc4BBFq3Dt6mq3VGz6PKd/gSi2OnjvHY5/5P1G/Yfpr0wbyHz5NhsQC7W4tsnK67qqmktQPkO3wzCOrWEKn2Z+Gdq5BKTbM0XyLXAYppc1xk2qjDdvT5OYAA7WiqcyjUKJhsHHwa+HeWx48kC0Y2gPOmRQ8PpBbHxMr4W2FXjgKcdhk109oyD4aqw4Co3md3y5pKP4+KHlNsVjdCS7uLkEZUR+sUyuRNjkyPu6g4PaleNQN+ienEHHdmWpD+XlCIDOA35DiNFBYK7pobLZrzONJ3OysFvRbuEVEkQmvb0aOw059kZvjNkC4Rf6Tr8/Wy3n1jaIAHdnfMIwtiQ8tjHE3s7qnhijdENfwxiWURzo44b11Ovi9ahECejOil82J6riLgGCMo5+NS7pwGqHWAEvNazTfEyKjMexcKPZUbgBR3ctsp74JF16KaaDV4RubI/MXujgxnqv1ejMvz1rcqppogjqRcUfKvVBjXyrjgjpCW89LL4nlW57ipoH7RcTBBUAPsFzFmoKtJRvhu4tw90cteOuW+cqZXgXbNnGEBntjd3IxfGwEQ1dCFgyhnBS3EtSC7WV+12Mxy6Mvl4TcxXRbpkeJjks7TNIpWFdMp12QBNLKbkh53HejXS+lhnPKBWfTQJhsTfnFBwO4Coho8ENfHRCvKcxkSvZaqggsE9iBCWqouZpWo9DGpbohpgHY2Myt+fA70ez3Sw94x9/izz3oay6khAgh+2N28+HFPSyCqIUBxXTwiiq/N8amAkm78CYHdm5BONCtgY17vzZVzOMec7URMA3RnLxeBOu1zete7sbgx/kZmT7q64qdGsL8wQsADFoxVRDWEu0hnKq7fG7sdtG2BveTu66NF9OlWRFoqmkpWwLGVb2Vz5BoxDdCL0x5UZFfT2z8G3GdBRi81MuvrWJz31CZlDYTQxQq1EPyfvxsT9oYmkXhENUhaSvGI4/i3Of7cdVVgixiU67metcjZnCj2TiE91Qh/Xvzn/4xdRLpqxN7L5ohukiCmAbp32uehOe1asPAuwC4T0ZkGPCR9jcxe9OUP6CZRyMJa5mmGNQ7C7q5MmLUAngwZUIhq+G2ybzTKKXfV/WPsd51EHEqRMzkH/K8WOstUSE5ja1dN6V7oRoM46N/Na4Tf9jqQJzXKf8tmiJ7VAYD+bOPa9HQudOTvNQ9MWL+E7thptMtXATnveY6GKKw/6zyFcOZwasLb0JwR1DkM91THO+llN22lO8szXQxtL4WXVOYrfUzlEvp1+eiCGIKAlk2D6tPlPZpihFfaNwAwrE2Uu3ElZfpTaMJabfJVAF8nkbUk9GNI+h3lfOYXzz66+BFpz+0ifZ+bMO6Zv9bCghDeHA7J7l6H4sMjqqHvib8pfkiaYHml1lyfs5ZvfVEVnGpcJG1vUxHbz65GYXXhPq2I50mLTYd9SLbASsU0u4AA49rDpW6cXQX2vXx38CQ6uYjJsROxJbVMPBOQcmf1rM+NYRXWE22Xc4/HM1locQhr8XlvPBfUGb2JqAY7gZ3K01EEe5tzfS63xLZQFp75Kbb1WVc+WyeLz1aEY6rCuRTPxnQbeUZIA/jpCE09dtj3fS+xo0vjV5RPBEgSY6SkEpnNPBqPM13f+mwXWTeldknqoWARX2eu/haEP4dT3RzLPLS7czInEdXQncAuI9inulDKk/RkGC72idqK+N61QO1i6pABkzPSuSG1G8AXxM5tTBgpplW7nqmwzswwG4gIkO6EtQjIDx585MnAgmXlyaaDiJRUCwhCXHO4PGop4/TSg4/8qHaXlG9ENfRgEJ7VGGQqcKcVgT22Y+aiY/iiIvrng2EC8M/mBXZ2s/rdRKBKcUWx4eLgnzn4MREgf67BCxWQqcPr3uB9puvrVO/JTh0dz1IvZUFmWvRzeKbriswRVzeBbrXQGiCqYcBF7D+hqCI70Wfq6KLWJ2Ukeo2IBgjHznlaLKrp9yuLVbokRl7U4VwiQHb2mawzifbZwhHH3Ik+03OfmWPj+U43GjaMXqjM4XITSB5XNsgYq4hqcExkL1Vkl2eUS5E9MeGcT3wyvwqt/RTSOH8Awdq2TDcNP4T8HVWMJOrkSQR76Oj8k64fGfbUmz571D5zqjaIA20j7ZIxlqHhOJX1ZTGi3S3HKmIaUQ2OGotn8yv9+T+2KmpP9HHp7HPJi/lVMM35SuUAO5AF8mGg3xW041jM+4XWdJj28PZrh77nfzZbU8MTffraEH0wv2pNrC3G3EPsk3zgPqsea1q57oQP3DYyFiXzo02m2hA2uy9bPZQdew5wDkvbzSs+8qxnu/uo8yKzHKs+jtGh/KHNXz9+/MD9hNHR3brtStynW47saQtD86QTqzrJNlt/fiZ1GwDgN9u8fbXgMTclvFQc7lwdpjUblIP1WWKOv92iXCurm8rrkCJZKl5KnyPRv26ywf9YaZcNYxkcHafY3ZH4/wUYAG6I/m/ibBhhAAAAAElFTkSuQmCC";

/**
 * ============================================================================
 * 1. AUDIT TRAIL & SEGURIDAD (NÚCLEO ALCOA+ BLINDADO)
 * ============================================================================
 */

function obtenerHoraServidor() {
    return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
}

function registrarAuditTrail(usuario, modulo, accion, detalle) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetAudit = ss.getSheetByName('AUDIT_TRAIL');
        const horaExacta = obtenerHoraServidor();
        sheetAudit.appendRow([horaExacta, usuario, modulo, accion, detalle]);
        SpreadsheetApp.flush();
    } catch (e) {
        console.error("Fallo crítico en Audit Trail: " + e.message);
    } finally {
        lock.releaseLock();
    }
}

function computeSHA256(input) {
    const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
    let txtHash = '';
    for (let i = 0; i < rawHash.length; i++) {
        let hashVal = rawHash[i];
        if (hashVal < 0) { hashVal += 256; }
        if (hashVal.toString(16).length == 1) { txtHash += '0'; }
        txtHash += hashVal.toString(16);
    }
    return txtHash;
}

function loginInterno(usuarioInput, passwordHashInput) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const ws = ss.getSheetByName('USUARIOS');
    const data = ws.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
        if (data[i][3] === usuarioInput) {
            if (data[i][5] === 'Bloqueado') return { success: false, message: "Bloqueado por QA." };
            if (data[i][4] === passwordHashInput) {
                ws.getRange(i + 1, 7).setValue(0);
                registrarAuditTrail(usuarioInput, 'Seguridad', 'Login', 'Ingreso exitoso.');
                return { success: true, nombre: data[i][1], rol: data[i][2], usuario: data[i][3], area: data[i][8] };
            } else {
                let intentos = (parseInt(data[i][6]) || 0) + 1;
                ws.getRange(i + 1, 7).setValue(intentos);
                registrarAuditTrail(usuarioInput, 'Seguridad', 'Fallo de Login', `Intento ${intentos} de 3. Contraseña incorrecta.`);
                if (intentos >= 3) {
                    ws.getRange(i + 1, 6).setValue('Bloqueado');
                    registrarAuditTrail('SISTEMA', 'Seguridad', 'Bloqueo Automático', `Usuario ${usuarioInput} bloqueado por exceso de intentos.`);
                }
                return { success: false, message: "Error. Intento " + intentos + " de 3." };
            }
        }
    }
    return { success: false, message: "Usuario no encontrado." };
}

function cambiarPasswordObligatorio(usuarioLogin, nuevoHash) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const ws = ss.getSheetByName('USUARIOS');
        const data = ws.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][3] === usuarioLogin) {
                ws.getRange(i + 1, 5).setValue(nuevoHash);
                ws.getRange(i + 1, 8).setValue(new Date());
                registrarAuditTrail(usuarioLogin, 'Seguridad', 'Cambio de Contraseña', 'Actualización de clave temporal (CFR 21).');
                return { success: true, mensaje: "Contraseña actualizada correctamente." };
            }
        }
        return { success: false, error: "Usuario no encontrado." };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}

function registrarCierreSesion(usuario, motivo) {
    registrarAuditTrail(usuario, 'Seguridad', 'Logout', motivo);
    return { success: true };
}

function verificarPermisoBackend(usuarioLogin, rolesPermitidos) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const ws = ss.getSheetByName('USUARIOS');
    if (!ws) return false;
    const data = ws.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
        if (data[i][3] === usuarioLogin) {
            if (data[i][5] !== 'Activo') return false;
            if (rolesPermitidos.includes(data[i][2]) || rolesPermitidos.includes('Todos')) return true;
            return false;
        }
    }
    return false;
}


/**
 * ============================================================================
 * 2. GESTIÓN DE USUARIOS
 * ============================================================================
 */
function obtenerUsuariosBD() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const ws = ss.getSheetByName('USUARIOS');
    if (!ws) return [];
    const data = ws.getDataRange().getValues();
    if (data.length <= 1) return [];

    return data.slice(1).map(fila => ({
        id: String(fila[0] || ''), nombre: String(fila[1] || ''), rol: String(fila[2] || ''),
        usuario: String(fila[3] || ''), estatus: String(fila[5] || 'Activo'), intentos: fila[6] || 0,
        area: String(fila[8] || 'No definida')
    }));
}

function gestionarUsuario(datos) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const rolesAdmin = ['Administrador', 'Gerente', 'Jefe de Control de Calidad'];
        if (!verificarPermisoBackend(datos.autorizador, rolesAdmin)) {
            registrarAuditTrail(datos.autorizador, 'Seguridad', 'Violación de Acceso', `Intento de hackeo: Creación/Edición de usuario denegada.`);
            throw new Error("Bloqueo CFR 21: Tu rol real no te permite administrar usuarios.");
        }
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const wsUsuarios = ss.getSheetByName('USUARIOS');

        const data = wsUsuarios.getDataRange().getValues();
        let filaEncontrada = -1; let idFinal = datos.id;

        if (!idFinal || idFinal === 'Autogenerado al guardar') {
            let maxNum = 0;
            for (let i = 1; i < data.length; i++) {
                let currentId = String(data[i][0]);
                if (currentId.startsWith('U-')) {
                    let num = parseInt(currentId.replace('U-', ''), 10);
                    if (num > maxNum) maxNum = num;
                }
            }
            idFinal = 'U-' + String(maxNum + 1).padStart(3, '0');
        } else {
            for (let i = 1; i < data.length; i++) {
                if (String(data[i][0]) === idFinal) { filaEncontrada = i + 1; break; }
            }
        }

        let hashParaGuardar = ''; let fechaPass = new Date();
        if (datos.clavePlana && datos.clavePlana.trim() !== '') {
            hashParaGuardar = computeSHA256(datos.clavePlana.trim());
        } else if (filaEncontrada !== -1) {
            hashParaGuardar = data[filaEncontrada - 1][4]; fechaPass = data[filaEncontrada - 1][7];
        } else { throw new Error("Un usuario nuevo requiere obligatoriamente una clave temporal."); }

        const filaInsertar = [idFinal, datos.nombre, datos.rol, datos.usuario, hashParaGuardar, datos.estatus, 0, fechaPass, datos.area];

        let accionAudit = "";
        if (filaEncontrada !== -1) {
            wsUsuarios.getRange(filaEncontrada, 1, 1, filaInsertar.length).setValues([filaInsertar]);
            accionAudit = "Actualización de Usuario";
        } else {
            wsUsuarios.appendRow(filaInsertar); accionAudit = "Alta de Usuario";
        }

        registrarAuditTrail(datos.autorizador, 'Configuración', accionAudit, `ID: ${idFinal} | Rol: ${datos.rol} | Estatus: ${datos.estatus}`);
        return { success: true, mensaje: `Usuario ${idFinal} guardado exitosamente.` };

    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}


/**
 * ============================================================================
 * 3. GESTIÓN DE MUESTRAS Y PLAN ANALÍTICO
 * ============================================================================
 */
function ingresarMuestra(producto, loteI, loteP, cant, user, esEst, codEst, numAn) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('MUESTRAS');
        const loteProv = (loteP && loteP.trim() !== '') ? loteP : loteI;

        sheet.appendRow([
            "'" + loteI, producto, "'" + loteProv, cant, 'Cuarentena', new Date(), user,
            (esEst ? 'Estabilidad' : 'Rutina'), (esEst ? codEst : 'N/A'), '', "'" + numAn
        ]);
        registrarAuditTrail(user, 'Muestras', 'Ingreso', `Lote: ${loteI} (${producto}) | Análisis: ${numAn}`);
        return { success: true, loteInterno: loteI, mensaje: "Muestra registrada correctamente." };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}

function iniciarAnalisisMasivo(lotesArray, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('MUESTRAS');
        const data = sheet.getDataRange().getValues();
        const lotesL = lotesArray.map(l => String(l).replace(/^'/, '').trim());
        let cont = 0; let detallesLotes = [];

        for (let i = 1; i < data.length; i++) {
            let loteF = String(data[i][0]).replace(/^'/, '').trim();
            if (lotesL.includes(loteF) && data[i][4] === 'Cuarentena') {
                sheet.getRange(i + 1, 5).setValue('En Análisis');
                detallesLotes.push(`${loteF} (${data[i][1]})`);
                cont++;
            }
        }
        registrarAuditTrail(usuarioActual, 'Muestras', 'Análisis Masivo', `Iniciados: ${detallesLotes.join(', ')}`);
        return { success: true, mensaje: `Iniciados: ${cont}` };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}

function cambiarEstatusMuestra(loteInterno, nuevoEstatus, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const sheetMuestras = SpreadsheetApp.openById(SHEET_ID).getSheetByName('MUESTRAS');
        const data = sheetMuestras.getDataRange().getValues();
        const loteLimpioBuscar = String(loteInterno).replace(/^'/, '').trim();
        let filaActualizar = -1; let valorAnterior = ''; let producto = '';

        for (let i = 1; i < data.length; i++) {
            let loteFila = String(data[i][0]).replace(/^'/, '').trim();
            if (loteFila === loteLimpioBuscar) {
                filaActualizar = i + 1; valorAnterior = data[i][4]; producto = data[i][1]; break;
            }
        }
        if (filaActualizar === -1) throw new Error(`Lote '${loteLimpioBuscar}' no encontrado.`);

        sheetMuestras.getRange(filaActualizar, 5).setValue(nuevoEstatus);
        registrarAuditTrail(usuarioActual, 'Muestras', 'Cambio de Estatus', `Lote: ${loteLimpioBuscar} (${producto}) | ${valorAnterior} -> ${nuevoEstatus}`);
        return { success: true, mensaje: `Estatus actualizado a ${nuevoEstatus}` };
    } catch (error) { return { success: false, error: error.message }; } finally { lock.releaseLock(); }
}

function obtenerPlanDeAnalisisPT(nombreProducto, tipoAnalisis = 'Rutina', loteInterno = '') {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetProductos = ss.getSheetByName('PRODUCTOS_PT');
        const sheetPruebas = ss.getSheetByName('PRUEBAS_ESPECIFICAS_PT');
        const sheetResultados = ss.getSheetByName('RESULTADOS_ANALISIS');

        const dataProductos = sheetProductos.getDataRange().getValues();
        let idProducto = null; let formaFarmaceutica = null;
        for (let i = 1; i < dataProductos.length; i++) {
            if (dataProductos[i][1] === nombreProducto) {
                idProducto = dataProductos[i][0]; formaFarmaceutica = dataProductos[i][2]; break;
            }
        }
        if (!idProducto) return { success: false, error: `El producto '${nombreProducto}' no está registrado.` };

        const resultadosPrevios = {};
        if (loteInterno && sheetResultados) {
            const dataRes = sheetResultados.getDataRange().getValues();
            const loteLimpio = String(loteInterno).replace(/^'/, '').trim();
            const loteAgnostico = loteLimpio.replace(/^0+/, '');
            for (let r = 1; r < dataRes.length; r++) {
                let loteFilaRes = String(dataRes[r][0]).replace(/^'/, '').trim().replace(/^0+/, '');
                if (loteFilaRes === loteAgnostico) {
                    resultadosPrevios[dataRes[r][1]] = { valor: String(dataRes[r][3]).replace(/^'/, ''), evaluacion: dataRes[r][4] };
                }
            }
        }

        const dataPruebas = sheetPruebas.getDataRange().getValues();
        const pruebasAsignadas = [];
        for (let j = 1; j < dataPruebas.length; j++) {
            if (dataPruebas[j][0] === idProducto) {
                let nombrePrueba = String(dataPruebas[j][1]);
                let pruebaNormalizada = nombrePrueba.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                if (tipoAnalisis !== 'Estabilidad') {
                    if (pruebaNormalizada.includes('sedimentacion') || pruebaNormalizada.includes('resuspendibilidad')) continue;
                }
                pruebasAsignadas.push({
                    prueba: nombrePrueba, clavePNO: String(dataPruebas[j][2] || ''), metodo: String(dataPruebas[j][3] || ''),
                    limite: String(dataPruebas[j][4] || ''), urlPNO: String(dataPruebas[j][5] || ''),
                    valorPrevio: resultadosPrevios[nombrePrueba] ? resultadosPrevios[nombrePrueba].valor : '',
                    evalPrevio: resultadosPrevios[nombrePrueba] ? resultadosPrevios[nombrePrueba].evaluacion : ''
                });
            }
        }
        return { success: true, idProducto, producto: nombreProducto, formaFarmaceutica, planDeAnalisis: pruebasAsignadas };
    } catch (error) { return { success: false, error: error.message }; }
}

function evaluarResultadoRealBackend(valorIngresado, especificacion) {
    if (!valorIngresado || String(valorIngresado).trim() === '') return 'En Proceso';

    let valStr = String(valorIngresado).trim();
    let specStr = String(especificacion).trim().toLowerCase();

    if (valStr.toLowerCase() === 'cumple con la prueba') return 'Cumple';
    if (valStr.toLowerCase() === 'no cumple con la prueba') return 'OOS';

    const sinonimosCero = ['ausencia', 'ausente', 'no detectado', 'nd', 'negativo'];
    if (sinonimosCero.some(s => valStr.toLowerCase() === s || valStr.toLowerCase().includes(s))) {
        if (/[<≤]|ausencia|negativo|max|máx|menor/.test(specStr)) return 'Cumple';
    }

    if (!/\d/.test(specStr)) {
        if (specStr.includes(valStr.toLowerCase()) || valStr.toLowerCase().includes(specStr)) return 'Cumple';
        return 'OOS';
    }

    let valNumericoStr = valStr.replace(/,/g, '').replace(/[<>≤≥=]/g, '').trim();
    let val = parseFloat(valNumericoStr);
    if (isNaN(val)) return 'OOS';

    // 💡 Decodificar HTML y limpiar comas
    let specClean = specStr
        .replace(/&le;|&#8804;/g, '≤')
        .replace(/&ge;|&#8805;/g, '≥')
        .replace(/&lt;|&#60;/g, '<')
        .replace(/&gt;|&#62;/g, '>')
        .replace(/,/g, '');

    let matchRango = specClean.match(/([0-9.]+)\s*[-–—]\s*([0-9.]+)/);
    if (matchRango) {
        return (val >= parseFloat(matchRango[1]) && val <= parseFloat(matchRango[2])) ? 'Cumple' : 'OOS';
    }

    let matchMenor = specClean.match(/(?:[<≤]|max|máx|menor|no m[aá]s).*?([0-9.]+)/);
    if (matchMenor) {
        return (val <= parseFloat(matchMenor[1])) ? 'Cumple' : 'OOS';
    }

    let matchMayor = specClean.match(/(?:[>≥]|min|mín|mayor|no menos).*?([0-9.]+)/);
    if (matchMayor) {
        return (val >= parseFloat(matchMayor[1])) ? 'Cumple' : 'OOS';
    }

    let matchExacto = specClean.match(/([0-9.]+)/);
    if (matchExacto) {
        return (val === parseFloat(matchExacto[1])) ? 'Cumple' : 'OOS';
    }

    return 'OOS';
}

function guardarResultadosYDictamen(loteI, resultadosArray, dictamenFinal, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetRes = ss.getSheetByName('RESULTADOS_ANALISIS');
        const sheetMue = ss.getSheetByName('MUESTRAS');

        const loteLimpio = String(loteI).replace(/^'/, '').trim();
        const loteAgnostico = loteLimpio.replace(/^0+/, '');
        const loteSeguro = "'" + loteLimpio;

        const dataRes = sheetRes.getDataRange().getValues();
        let nuevas = [];

        resultadosArray.forEach(item => {
            let encontrada = false;
            for (let i = 1; i < dataRes.length; i++) {
                let loteBd = String(dataRes[i][0]).replace(/^'/, '').trim().replace(/^0+/, '');
                if (loteBd === loteAgnostico && dataRes[i][1] === item.prueba) {
                    encontrada = true;
                    sheetRes.getRange(i + 1, 1).setValue(loteSeguro);
                    sheetRes.getRange(i + 1, 4).setValue("'" + item.resultado);
                    sheetRes.getRange(i + 1, 5).setValue(item.evaluacion);
                    sheetRes.getRange(i + 1, 6).setValue(usuarioActual);
                    sheetRes.getRange(i + 1, 7).setValue(new Date());
                    sheetRes.getRange(i + 1, 8).setValue(item.loteReactivo || "");
                    break;
                }
            }
            if (!encontrada) {
                nuevas.push([loteSeguro, item.prueba, item.especificacion, "'" + item.resultado, item.evaluacion, usuarioActual, new Date(), item.loteReactivo || ""]);
            }
        });

        if (nuevas.length > 0) sheetRes.getRange(sheetRes.getLastRow() + 1, 1, nuevas.length, nuevas[0].length).setValues(nuevas);

        const dataM = sheetMue.getDataRange().getValues();
        for (let j = 1; j < dataM.length; j++) {
            let loteBd = String(dataM[j][0]).replace(/^'/, '').trim().replace(/^0+/, '');
            if (loteBd === loteAgnostico) { sheetMue.getRange(j + 1, 5).setValue(dictamenFinal); break; }
        }
        registrarAuditTrail(usuarioActual, 'Resultados', 'Captura Analítica', `Lote: ${loteLimpio} | Nuevos resultados guardados: ${nuevas.length}`);
        return { success: true, mensaje: "Datos guardados con trazabilidad." };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}


/**
 * ============================================================================
 * 4. DICTAMEN Y FIRMAS (CFR 21)
 * ============================================================================
 */
function dictaminarMuestraConFirma(loteInterno, nuevoEstatus, usuarioLogin, passwordIntento) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetUsuarios = ss.getSheetByName('USUARIOS');
        const sheetMuestras = ss.getSheetByName('MUESTRAS');

        const dataUsuarios = sheetUsuarios.getDataRange().getValues();
        let passwordReal = null; let nombreCompleto = null; let usuarioEncontrado = false;
        for (let i = 1; i < dataUsuarios.length; i++) {
            if (dataUsuarios[i][3] === usuarioLogin) {
                usuarioEncontrado = true; passwordReal = String(dataUsuarios[i][4]); nombreCompleto = dataUsuarios[i][1]; break;
            }
        }
        if (!usuarioEncontrado || computeSHA256(passwordIntento) !== passwordReal) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Seguridad / Dictamen", "Firma Electrónica Fallida", `Intento fallido en lote ${loteInterno}.`);
            return { success: false, error: "Firma Electrónica Inválida: Contraseña incorrecta." };
        }

        const dataMuestras = sheetMuestras.getDataRange().getValues();
        let filaMuestra = -1; let producto = "";
        const loteBuscar = String(loteInterno).replace(/^'/, '').trim();

        for (let i = 1; i < dataMuestras.length; i++) {
            if (String(dataMuestras[i][0]).replace(/^'/, '').trim() === loteBuscar) {
                filaMuestra = i + 1; producto = dataMuestras[i][1]; break;
            }
        }
        if (filaMuestra === -1) return { success: false, error: "Error: Lote no encontrado." };

        sheetMuestras.getRange(filaMuestra, 5).setValue(nuevoEstatus);

        if (nuevoEstatus === 'En Análisis') {
            registrarAuditTrail(usuarioLogin, "Resultados", "Firma de Avance", `Avance firmado por ${nombreCompleto} para el lote ${loteBuscar} (${producto}).`);
        } else {
            registrarAuditTrail(usuarioLogin, "Dictamen Lotes", "Firma Electrónica Aplicada", `Lote ${loteBuscar} (${producto}) enviado a [${nuevoEstatus}] por ${nombreCompleto}.`);
        }
        return { success: true, mensaje: "Firma Electrónica válida." };
    } catch (error) { return { success: false, error: error.message }; }
}

function liberarMasivoConFirma(lotesArray, usuarioLogin, passwordIntento) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetUsuarios = ss.getSheetByName('USUARIOS');
        const sheetMuestras = ss.getSheetByName('MUESTRAS');

        const dataUsuarios = sheetUsuarios.getDataRange().getValues();
        let passwordReal = null; let nombreCompleto = null; let usuarioEncontrado = false;
        for (let i = 1; i < dataUsuarios.length; i++) {
            if (dataUsuarios[i][3] === usuarioLogin) {
                usuarioEncontrado = true; passwordReal = String(dataUsuarios[i][4]); nombreCompleto = dataUsuarios[i][1]; break;
            }
        }
        if (!usuarioEncontrado || computeSHA256(passwordIntento) !== passwordReal) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Liberación", "Firma Electrónica Fallida", `Intento fallido de liberación masiva.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        const dataMuestras = sheetMuestras.getDataRange().getValues();
        let lotesLimpios = lotesArray.map(l => String(l).replace(/^'/, '').trim());
        let procesados = 0;
        let detalleLotes = [];

        for (let i = 1; i < dataMuestras.length; i++) {
            let loteFila = String(dataMuestras[i][0]).replace(/^'/, '').trim();
            if (lotesLimpios.includes(loteFila) && dataMuestras[i][4] === 'Aprobado') {
                sheetMuestras.getRange(i + 1, 5).setValue('Liberado');
                detalleLotes.push(`${loteFila} (${dataMuestras[i][1]})`);
                procesados++;
            }
        }

        registrarAuditTrail(usuarioLogin, "Liberación", "Firma Electrónica Aplicada", `[${procesados}] lotes liberados por ${nombreCompleto}: ${detalleLotes.join(', ')}`);
        return { success: true, mensaje: `${procesados} lotes Liberados con éxito.` };
    } catch (error) { return { success: false, error: error.message }; } finally { lock.releaseLock(); }
}


/**
 * ============================================================================
 * 5. INVENTARIOS Y CEPARIO
 * ============================================================================
 */
function obtenerInventarioRecepcion() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName('INV_RECEPCION');
        if (!sheet) throw new Error("Pestaña INV_RECEPCION no encontrada.");
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) return [];

        return data.slice(1).filter(f => String(f[13]) !== 'Agotado').map(f => ({
            idInsumo: String(f[0]).trim(), categoria: String(f[1]).trim(), nombre: String(f[2]).trim(),
            proveedor: String(f[3]).trim(), loteProv: String(f[4]).trim(),
            factorPrep: parseFloat(String(f[9]).replace(',', '.').replace(/[^0-9.]/g, '')) || null,
            pm: parseFloat(String(f[10]).replace(',', '.').replace(/[^0-9.]/g, '')) || null,
            pureza: parseFloat(String(f[11]).replace(',', '.').replace(/[^0-9.]/g, '')) || 100,
            densidad: parseFloat(String(f[12]).replace(',', '.').replace(/[^0-9.]/g, '')) || null
        }));
    } catch (e) { return { error: e.message }; }
}

/**
 * 1. GUARDAR PREPARACIÓN (Columnas corregidas, Nomenclatura original y pH)
 */
function guardarNuevaPreparacion(datos, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheetPrep = ss.getSheetByName('INV_PREPARACION');

        const abreviatura = datos.idInsumoBase || "MED";
        const hoy = new Date();
        const fechaCod = Utilities.formatDate(hoy, Session.getScriptTimeZone(), "ddMMyy");
        const baseLote = `${abreviatura}-${fechaCod}`;

        const dataExistente = sheetPrep.getDataRange().getValues();
        let contador = 0;
        for (let i = 1; i < dataExistente.length; i++) {
            if (String(dataExistente[i][0]).startsWith(baseLote)) contador++;
        }

        const loteFinal = contador === 0 ? baseLote : `${baseLote}-${contador + 1}`;

        // ✅ EL AGREGADO DEL pH EN LA RECETA
        let recetaTexto = `${datos.nombreReactivo} [Lote Prov: ${datos.loteProv}] -> Teórico: ${datos.volumenTeorico} ${datos.unidad} | Real: ${datos.cantidadReal} ${datos.unidad}`;
        if (datos.tipo === 'Medio Simple') {
            recetaTexto += ` | pH Final: ${datos.phFinal}`;
        }

        // ✅ LAS 11 COLUMNAS EXACTAS CON EL pH INCLUIDO
        const fila = [
            loteFinal,             // A: Lote_Interno
            datos.tipo,            // B: Tipo_Preparacion
            datos.volumenFinal,    // C: Volumen_Final_mL
            recetaTexto,           // D: Receta_Consumida
            datos.concentracionReal || "N/A", // E: Concentracion_Real
            new Date(),            // F: Fecha_Prep
            usuarioActual,         // G: Analista
            datos.caducidadInterna,// H: Caducidad_Interna
            datos.phInicial || "", // I: phInicial
            datos.phFinal || "",   // J: phFinal
            datos.estatusInicial   // K: Estatus
        ];

        sheetPrep.appendRow(fila);

        // 💡 AQUÍ ESTÁ EL BLINDAJE: Enviamos el registro exacto al Audit Trail
        registrarAuditTrail(usuarioActual, 'Inventario', 'Nueva Preparación', `Lote Generado: ${loteFinal} | Real: ${datos.cantidadReal} ${datos.unidad}`);

        return { success: true, loteInterno: loteFinal, mensaje: `Lote ${loteFinal} generado.` };
    } catch (e) { return { success: false, error: e.message }; }
    finally { lock.releaseLock(); }
}

function obtenerLotesReactivosDisponibles() {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('INV_PREPARACION');
        const data = sheet.getDataRange().getValues();
        const hoy = new Date();
        return data.slice(1).filter(f => f[8] === 'Liberado' && new Date(f[7]) >= hoy).map(f => f[0]);
    } catch (e) { return []; }
}

function obtenerInventariosCompletos() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const sheetRec = ss.getSheetByName('INV_RECEPCION');
        const sheetPrep = ss.getSheetByName('INV_PREPARACION');
        const sheetCepas = ss.getSheetByName('INV_CEPAS');

        let stock = [];
        if (sheetRec) {
            const dataRec = sheetRec.getDataRange().getValues();
            stock = dataRec.slice(1).filter(f => String(f[13]) !== 'Agotado').map(f => ({
                idInsumo: String(f[0]), nombre: String(f[2]), proveedor: String(f[3]),
                loteProv: String(f[4]), caducidad: f[8] instanceof Date ? f[8].toISOString() : String(f[8]), estatus: String(f[13])
            }));
        }

        let preparaciones = [];
        if (sheetPrep) {
            const dataPrep = sheetPrep.getDataRange().getValues();
            preparaciones = dataPrep.slice(1).map(f => {
                // PARCHE: Si la columna K (10) existe, usa esa. Si no, usa la I (8) de los lotes viejos.
                let estatusReal = (f[10] !== undefined && String(f[10]).trim() !== '') ? String(f[10]) : String(f[8]);
                return {
                    lote: String(f[0]),
                    tipo: String(f[1]),
                    receta: String(f[3]),
                    fechaPrep: f[5] instanceof Date ? f[5].toISOString() : String(f[5]),
                    caducidad: f[7] instanceof Date ? f[7].toISOString() : String(f[7]),
                    estatus: estatusReal
                };
            });
        }

        let cepas = [];
        if (sheetCepas) {
            const dataCepas = sheetCepas.getDataRange().getValues();
            cepas = dataCepas.slice(1).filter(f => String(f[8]) !== 'Inactiva').map(f => ({
                idTubo: String(f[0]).trim(), microorganismo: String(f[1]), atcc: String(f[2]),
                loteProv: String(f[3]), fechaRehid: f[4] instanceof Date ? f[4].toISOString() : String(f[4]),
                pases: parseInt(f[5]) || 0, caducidad: f[6] instanceof Date ? f[6].toISOString() : String(f[6]),
                analista: String(f[7]), estatus: String(f[8]) || 'Sin Rehidratar',
                cepaBase: String(f[9] || ''), caducidadProv: f[10] instanceof Date ? f[10].toISOString() : String(f[10] || '')
            }));
        }

        return { success: true, stock: stock, preparaciones: preparaciones, cepas: cepas };
    } catch (e) { return { success: false, error: e.message }; }
}

/**
 * REGISTRO DE NUEVO INSUMO CON ID AUTOGENERADO (S, R, SRP)
 */
function registrarNuevoInsumo(datos, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName('INV_RECEPCION');
        const data = sheet.getDataRange().getValues();

        // 1. Determinar Letra Indicadora
        let prefijo = "R"; // Default para Sales, Ácidos, Bases, Buffers, Otros
        if (datos.categoria === "Solventes") prefijo = "S";
        else if (datos.categoria === "Estándares") prefijo = "SRP";

        // 2. Generar Código de Fecha ddmmaa
        const hoy = new Date();
        const fechaCod = Utilities.formatDate(hoy, Session.getScriptTimeZone(), "ddMMyy");
        const baseID = `${prefijo}-${fechaCod}`;

        // 3. Calcular número de ingreso del día (Contador)
        let contadorDia = 0;
        for (let i = 1; i < data.length; i++) {
            let idExistente = String(data[i][0]);
            if (idExistente.startsWith(baseID)) {
                contadorDia++;
            }
        }
        const idFinal = `${baseID}/${contadorDia + 1}`;

        // 4. Preparar Fila (Columnas A-N)
        // ID_Insumo, Categoria, Nombre, Prov, Lote_Prov, Pres, Fech_Rec, Fech_Ap, Cad_Fab, Fac, PM, Pur, Den, Est
        const fila = [
            idFinal,           // A: ID Autogenerado
            datos.categoria,   // B
            datos.nombre,      // C
            datos.proveedor,   // D
            datos.loteProv,    // E
            datos.presentacion,// F
            new Date(),        // G: Fecha Recepción
            "No abierto",      // H
            datos.caducidad,   // I
            datos.factor,      // J
            datos.pm,          // K
            datos.pureza,      // L
            datos.densidad,    // M
            'Cuarentena'       // N
        ];

        sheet.appendRow(fila);

        registrarAuditTrail(usuarioActual, 'Almacén', 'Alta de Insumo', `Nuevo ID: ${idFinal} | Insumo: ${datos.nombre} | Lote: ${datos.loteProv}`);

        return { success: true, mensaje: `Insumo registrado con éxito. ID Asignado: ${idFinal}` };

    } catch (e) {
        return { success: false, error: e.message };
    } finally {
        lock.releaseLock();
    }
}

function registrarNuevaCepa(datos, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('INV_CEPAS');
        let cantidad = parseInt(datos.cantidad) || 1; let paseProv = parseInt(datos.paseProv) || 1;
        let nuevasFilas = []; let detallesLotes = [];

        for (let i = 1; i <= cantidad; i++) {
            let sufijo = cantidad > 1 ? ` (Stick ${i}/${cantidad})` : '';
            let loteIdentificado = datos.loteProv + sufijo;
            nuevasFilas.push([
                '', datos.microorganismo, datos.atcc, loteIdentificado, '', paseProv, '', '', 'Sin Rehidratar', '', datos.caducidadProv
            ]);
            detallesLotes.push(loteIdentificado);
        }
        sheet.getRange(sheet.getLastRow() + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);
        registrarAuditTrail(usuarioActual, 'Cepario', 'Alta de Liofilizados', `Cepa: ${datos.microorganismo} (ATCC: ${datos.atcc}) | Ingresados: ${cantidad} piezas.`);
        return { success: true, mensaje: `${cantidad} liofilizado(s) ingresado(s) al cepario.` };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}

function procesarMovimientoCepa(atcc, idTubo, microorganismo, accion, datos, usuarioLogin, passwordIntento) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const ss = SpreadsheetApp.openById(SHEET_ID);

        const sheetUsuarios = ss.getSheetByName('USUARIOS');
        const dataUsuarios = sheetUsuarios.getDataRange().getValues();
        let passwordReal = null; let nombreCompleto = null; let usuarioEncontrado = false;
        for (let i = 1; i < dataUsuarios.length; i++) {
            if (dataUsuarios[i][3] === usuarioLogin) {
                usuarioEncontrado = true; passwordReal = String(dataUsuarios[i][4]); nombreCompleto = dataUsuarios[i][1]; break;
            }
        }
        if (!usuarioEncontrado || computeSHA256(passwordIntento) !== passwordReal) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Cepario", "Firma Fallida", `Intento fallido en ${microorganismo}.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        const sheetCepas = ss.getSheetByName('INV_CEPAS');
        const dataCepas = sheetCepas.getDataRange().getValues();
        let filaEncontrada = -1; let paseActual = 0; let cepaBase = ""; let cadProv = "";
        const atccLimpio = String(atcc).trim(); const idTuboLimpio = String(idTubo).trim();

        if (accion === 'REHIDRATAR') {
            const loteProvBuscado = String(datos.loteProv).trim();
            for (let i = 1; i < dataCepas.length; i++) {
                if (String(dataCepas[i][2]).trim() === atccLimpio && String(dataCepas[i][3]).trim() === loteProvBuscado && (String(dataCepas[i][8]).trim() === 'Sin Rehidratar' || String(dataCepas[i][8]).trim() === '')) {
                    filaEncontrada = i + 1; cadProv = dataCepas[i][10] !== undefined ? String(dataCepas[i][10]).trim() : ''; break;
                }
            }
        } else {
            for (let i = 1; i < dataCepas.length; i++) {
                if (String(dataCepas[i][0]).trim() === idTuboLimpio && idTuboLimpio !== '') {
                    filaEncontrada = i + 1; paseActual = parseInt(dataCepas[i][5]) || 0; cepaBase = String(dataCepas[i][9]).trim() || '';
                    cadProv = dataCepas[i][10] !== undefined ? String(dataCepas[i][10]).trim() : ''; break;
                }
            }
        }

        if (filaEncontrada === -1) throw new Error(`Búsqueda fallida en BD. Cepa no encontrada.`);

        let detalleAudit = ""; let nuevasFilas = [];
        if (accion === 'REHIDRATAR') {
            let paseOrigen = parseInt(datos.paseInicial) || 1; let idCLS = datos.abreviatura.trim().toUpperCase() + "-CLS";
            sheetCepas.getRange(filaEncontrada, 1).setValue(idCLS);
            sheetCepas.getRange(filaEncontrada, 5).setValue(new Date());
            sheetCepas.getRange(filaEncontrada, 6).setValue(paseOrigen);
            sheetCepas.getRange(filaEncontrada, 7).setValue(datos.caducidad);
            sheetCepas.getRange(filaEncontrada, 8).setValue(nombreCompleto);
            sheetCepas.getRange(filaEncontrada, 9).setValue('Activa');
            sheetCepas.getRange(filaEncontrada, 10).setValue(datos.abreviatura.trim().toUpperCase());
            sheetCepas.getRange(filaEncontrada, 11).setValue(cadProv);
            detalleAudit = `Liofilizado Rehidratado. Creado Lote Semilla: ${idCLS} (Pase ${paseOrigen})`;
        }
        else if (accion === 'NUEVA_RAMA') {
            let nuevoPase = paseActual + 1; let letra = String(datos.letraRama).trim().toUpperCase(); let cantL = parseInt(datos.cantL) || 1;
            let idR = `${cepaBase}-${letra}${nuevoPase}R`;
            nuevasFilas.push([idR, microorganismo, atccLimpio, datos.loteProv, new Date(), nuevoPase, datos.caducidad, nombreCompleto, 'Activa', cepaBase, cadProv]);
            for (let i = 1; i <= cantL; i++) {
                let idL = `${cepaBase}-${letra}${nuevoPase}L${i}`;
                nuevasFilas.push([idL, microorganismo, atccLimpio, datos.loteProv, new Date(), nuevoPase, datos.caducidad, nombreCompleto, 'Activa', cepaBase, cadProv]);
            }
            detalleAudit = `Generación Cref de ${idTuboLimpio}. Creada Rama ${letra} (Pase ${nuevoPase}): 1 Reserva, ${cantL} Trabajo.`;
        }
        else if (accion === 'SUBCULTIVO') {
            let nuevoPase = paseActual + 1; let cantL = parseInt(datos.cantL) || 1;
            let ramaInfo = idTuboLimpio.replace(cepaBase + '-', ''); let letra = ramaInfo.charAt(0);
            let idR = `${cepaBase}-${letra}${nuevoPase}R`;
            nuevasFilas.push([idR, microorganismo, atccLimpio, datos.loteProv, new Date(), nuevoPase, datos.caducidad, nombreCompleto, 'Activa', cepaBase, cadProv]);
            for (let i = 1; i <= cantL; i++) {
                let idL = `${cepaBase}-${letra}${nuevoPase}L${i}`;
                nuevasFilas.push([idL, microorganismo, atccLimpio, datos.loteProv, new Date(), nuevoPase, datos.caducidad, nombreCompleto, 'Activa', cepaBase, cadProv]);
            }
            sheetCepas.getRange(filaEncontrada, 9).setValue('Inactiva');
            detalleAudit = `Subcultivo de ${idTuboLimpio}. Creada generación ${letra}${nuevoPase}: 1 Reserva, ${cantL} Trabajo. Tubo padre consumido.`;
        }
        else if (accion === 'INACTIVAR') {
            sheetCepas.getRange(filaEncontrada, 9).setValue('Inactiva');
            detalleAudit = `Tubo ${idTuboLimpio} destruido/consumido. Razón: ${datos.justificacion}`;
        }

        if (nuevasFilas.length > 0) sheetCepas.getRange(sheetCepas.getLastRow() + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);
        registrarAuditTrail(usuarioLogin, "Cepario", accion, `Cepa: ${microorganismo} | ${detalleAudit}`);
        return { success: true, mensaje: `Movimiento de Cepa (${accion}) registrado con éxito.` };

    } catch (error) { return { success: false, error: error.message }; } finally { lock.releaseLock(); }
}

function actualizarEstatusInventarioMasivoConFirma(lotesArray, tipoInv, nuevoEstatus, justificacion, usuarioLogin, passwordIntento) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(15000);
        const ss = SpreadsheetApp.openById(SHEET_ID);

        const sheetUsuarios = ss.getSheetByName('USUARIOS');
        const dataUsuarios = sheetUsuarios.getDataRange().getValues();
        let passwordReal = null; let usuarioEncontrado = false;
        for (let i = 1; i < dataUsuarios.length; i++) {
            if (dataUsuarios[i][3] === usuarioLogin) {
                usuarioEncontrado = true; passwordReal = String(dataUsuarios[i][4]); break;
            }
        }
        if (!usuarioEncontrado || computeSHA256(passwordIntento) !== passwordReal) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Inventarios", "Firma Masiva Fallida", `Intento masivo fallido.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        let nombreHoja = ''; let colEstatus = 9;
        if (tipoInv === 'STOCK') { nombreHoja = 'INV_RECEPCION'; colEstatus = 14; }
        else if (tipoInv === 'PREP') { nombreHoja = 'INV_PREPARACION'; colEstatus = 9; }
        else if (tipoInv === 'CEPAS') { nombreHoja = 'INV_CEPAS'; colEstatus = 9; }
        else return { success: false, error: "Tipo de inventario no válido." };

        const sheetInv = ss.getSheetByName(nombreHoja);
        const dataInv = sheetInv.getDataRange().getValues();
        let lotesLimpios = lotesArray.map(l => String(l).replace(/^'/, '').trim());
        let procesados = 0; let detalles = [];

        for (let i = 1; i < dataInv.length; i++) {
            let valorLote = "";
            if (tipoInv === 'STOCK') valorLote = String(dataInv[i][4]);
            else if (tipoInv === 'PREP') valorLote = String(dataInv[i][0]);
            else if (tipoInv === 'CEPAS') {
                let estatusCepa = String(dataInv[i][8]).trim();
                valorLote = (estatusCepa === 'Sin Rehidratar' || estatusCepa === '') ? String(dataInv[i][3]) : String(dataInv[i][0]);
            }

            let loteFila = valorLote.replace(/^'/, '').trim();
            if (lotesLimpios.includes(loteFila) && loteFila !== "") {
                let estatusAnterior = String(dataInv[i][colEstatus - 1]);
                if (estatusAnterior !== nuevoEstatus) {
                    sheetInv.getRange(i + 1, colEstatus).setValue(nuevoEstatus);
                    detalles.push(`${loteFila} (${estatusAnterior}->${nuevoEstatus})`);
                    procesados++;
                }
            }
        }

        if (procesados === 0) return { success: false, error: "No se encontraron lotes válidos o ya tienen ese estatus." };
        registrarAuditTrail(usuarioLogin, "Inventarios", "Cambio Estatus Masivo", `Lotes/Cepas: ${detalles.join(', ')} | Razón: ${justificacion}`);
        return { success: true, mensaje: `${procesados} elementos actualizados a ${nuevoEstatus} con éxito.` };
    } catch (error) { return { success: false, error: error.message }; } finally { lock.releaseLock(); }
}

// PUENTE: Alias para inventarios individuales en frontend
function actualizarEstatusInventarioConFirma(idLote, tipoInv, nuevoEstatus, justificacion, usuarioLogin, pwd) {
    return actualizarEstatusInventarioMasivoConFirma([idLote], tipoInv, nuevoEstatus, justificacion, usuarioLogin, pwd);
}


/**
 * ============================================================================
 * 6. MÓDULO EQUIPOS Y CALIBRACIÓN
 * ============================================================================
 */

function obtenerEquiposBD() {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('EQUIPOS_CALIBRACION');
        if (!sheet) return { success: false, error: "Hoja EQUIPOS_CALIBRACION no encontrada." };
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) return { success: true, equipos: [] };
        const equipos = data.slice(1).map(f => ({
            codigo: String(f[0]).trim(), equipo: String(f[1]).trim(), ubicacion: String(f[2]).trim(),
            proveedor: String(f[3]).trim(), frecuencia: parseInt(f[4]) || 12,
            ultima: f[5] instanceof Date ? f[5].toISOString() : String(f[5]),
            proxima: f[6] instanceof Date ? f[6].toISOString() : String(f[6]), estatus: String(f[7]).trim()
        }));
        return { success: true, equipos: equipos };
    } catch (e) { return { success: false, error: e.message }; }
}

function registrarCalibracionConFirma(codigoEquipo, fechaServicio, notas, usuarioLogin, passwordIntento) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheetUsuarios = ss.getSheetByName('USUARIOS');
        const dataUsuarios = sheetUsuarios.getDataRange().getValues();
        let passwordReal = null; let usuarioEncontrado = false;

        for (let i = 1; i < dataUsuarios.length; i++) {
            if (dataUsuarios[i][3] === usuarioLogin) {
                usuarioEncontrado = true; passwordReal = String(dataUsuarios[i][4]); break;
            }
        }
        if (!usuarioEncontrado || computeSHA256(passwordIntento) !== passwordReal) {
            registrarAuditTrail(usuarioLogin || "Desconocido", "Equipos", "Firma Fallida", `Intento fallido en equipo ${codigoEquipo}.`);
            return { success: false, error: "Firma Electrónica Inválida." };
        }

        const sheetEquipos = ss.getSheetByName('EQUIPOS_CALIBRACION');
        const dataEquipos = sheetEquipos.getDataRange().getValues();
        let fila = -1; let nombreEquipo = ""; let frecuenciaMeses = 12;

        for (let i = 1; i < dataEquipos.length; i++) {
            if (String(dataEquipos[i][0]).trim() === codigoEquipo) {
                fila = i + 1; nombreEquipo = String(dataEquipos[i][1]); frecuenciaMeses = parseInt(dataEquipos[i][4]) || 12; break;
            }
        }

        if (fila === -1) return { success: false, error: "Equipo no encontrado en la base de datos." };

        let fechaUltima = new Date(fechaServicio);
        fechaUltima.setMinutes(fechaUltima.getMinutes() + fechaUltima.getTimezoneOffset());
        let fechaProxima = new Date(fechaUltima);
        fechaProxima.setMonth(fechaProxima.getMonth() + frecuenciaMeses);

        sheetEquipos.getRange(fila, 6).setValue(fechaUltima);
        sheetEquipos.getRange(fila, 7).setValue(fechaProxima);
        sheetEquipos.getRange(fila, 8).setValue("Vigente");

        registrarAuditTrail(usuarioLogin, "Equipos", "Calibración Registrada", `Equipo: ${nombreEquipo} (${codigoEquipo}) | Fecha Serv: ${fechaServicio} | Notas: ${notas}`);
        return { success: true, mensaje: `Calibración registrada. Próximo servicio: ${fechaProxima.toLocaleDateString('es-MX')}` };

    } catch (error) { return { success: false, error: error.message }; } finally { lock.releaseLock(); }
}

function registrarNuevoEquipo(datos, usuarioActual) {
    const lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000);
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('EQUIPOS_CALIBRACION');
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (String(data[i][0]).trim().toUpperCase() === datos.codigo.trim().toUpperCase()) {
                throw new Error(`El código de equipo ${datos.codigo} ya existe.`);
            }
        }

        let frecuenciaMeses = parseInt(datos.frecuencia) || 12;
        let fechaUltima = new Date(datos.ultima);
        fechaUltima.setMinutes(fechaUltima.getMinutes() + fechaUltima.getTimezoneOffset());
        let fechaProxima = new Date(fechaUltima);
        fechaProxima.setMonth(fechaProxima.getMonth() + frecuenciaMeses);

        sheet.appendRow([datos.codigo.trim().toUpperCase(), datos.equipo.trim(), datos.ubicacion.trim().toUpperCase(), datos.proveedor.trim(), frecuenciaMeses, fechaUltima, fechaProxima, "Vigente"]);
        registrarAuditTrail(usuarioActual, 'Equipos', 'Alta de Equipo', `Registrado: ${datos.equipo} (${datos.codigo}) | Frecuencia: ${frecuenciaMeses} meses`);
        return { success: true, mensaje: "Equipo registrado correctamente en el programa." };
    } catch (e) { return { success: false, error: e.message }; } finally { lock.releaseLock(); }
}

/**
 * ============================================================================
 * 7. REPORTES DE CERTIFICADOS (PDF MASIVOS OPTIMIZADOS)
 * ============================================================================
 */

function obtenerListaProductos() {
    try {
        const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('PRODUCTOS_PT');
        const data = sheet.getDataRange().getValues();
        const productos = [];
        for (let i = 1; i < data.length; i++) { if (data[i][1]) productos.push(String(data[i][1]).trim()); }
        return [...new Set(productos)].sort();
    } catch (e) { return []; }
}

function obtenerMuestrasDashboard() {
    const data = SpreadsheetApp.openById(SHEET_ID).getSheetByName('MUESTRAS').getDataRange().getValues();
    if (data.length <= 1) return [];
    return data.slice(1).map(f => ({
        loteInterno: String(f[0]).replace(/^'/, '').trim(),
        producto: String(f[1]),
        loteProveedor: String(f[2]).replace(/^'/, '').trim(),
        cantidad: String(f[3]),
        estatus: String(f[4]),
        fechaIngreso: f[5] instanceof Date ? f[5].toISOString() : String(f[5]),
        usuario: String(f[6]),
        tipoAnalisis: String(f[7]),
        codigoEstabilidad: String(f[8]),
        tanda: String(f[9])
    }));
}

function formatearFechaEspanol(isoString) {
    if (!isoString) return '';
    const f = new Date(isoString);
    if (isNaN(f)) return isoString;
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${f.getDate().toString().padStart(2, '0')}-${meses[f.getMonth()]}-${f.getFullYear().toString()}`;
}

// OBTENCIÓN INDIVIDUAL (PARA EL MODAL WEB)
function obtenerDatosCertificado(loteI) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const dataMuestras = ss.getSheetByName('MUESTRAS').getDataRange().getValues();
        const dataProductos = ss.getSheetByName('PRODUCTOS_PT').getDataRange().getValues();
        const dataResultados = ss.getSheetByName('RESULTADOS_ANALISIS').getDataRange().getValues();
        const dataUsuarios = ss.getSheetByName('USUARIOS').getDataRange().getValues();
        return procesarUnCertificadoEnMemoria(loteI, dataMuestras, dataProductos, dataResultados, dataUsuarios);
    } catch (error) { return { success: false, error: error.message }; }
}

// OBTENCIÓN MASIVA OPTIMIZADA: Carga la BD una sola vez y procesa todo en RAM (Evita Exceso de Cuota)
function obtenerDatosCertificadosMasivo(lotesArray) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const dataMuestras = ss.getSheetByName('MUESTRAS').getDataRange().getValues();
        const dataProductos = ss.getSheetByName('PRODUCTOS_PT').getDataRange().getValues();
        const dataResultados = ss.getSheetByName('RESULTADOS_ANALISIS').getDataRange().getValues();
        const dataUsuarios = ss.getSheetByName('USUARIOS').getDataRange().getValues();

        const resultados = [];
        for (let i = 0; i < lotesArray.length; i++) {
            const res = procesarUnCertificadoEnMemoria(lotesArray[i], dataMuestras, dataProductos, dataResultados, dataUsuarios);
            if (res.success) resultados.push(res);
        }
        return { success: true, certificados: resultados };
    } catch (e) { return { success: false, error: e.message }; }
}

// MOTOR DE ENSAMBLADO EN MEMORIA (Extremadamente Rápido)
function procesarUnCertificadoEnMemoria(loteI, dataMuestras, dataProductos, dataResultados, dataUsuarios) {
    const loteB = String(loteI).replace(/^'/, '').trim();
    const loteAgnostico = loteB.replace(/^0+/, '');
    let muestra = null;

    for (let i = 1; i < dataMuestras.length; i++) {
        let loteFilaMue = String(dataMuestras[i][0]).replace(/^'/, '').trim().replace(/^0+/, '');
        if (loteFilaMue === loteAgnostico) {
            muestra = {
                loteInterno: loteB, producto: String(dataMuestras[i][1]),
                fechaIngreso: dataMuestras[i][5] instanceof Date ? dataMuestras[i][5].toISOString() : dataMuestras[i][5],
                tipoAnalisis: String(dataMuestras[i][7] || 'Rutina'),
                numAnalisis: String(dataMuestras[i][10] || 'No asignado'),
                estatus: String(dataMuestras[i][4])
            };
            break;
        }
    }
    if (!muestra) throw new Error("Muestra no encontrada.");

    let presentacion = "No especificada";
    for (let p = 1; p < dataProductos.length; p++) {
        if (String(dataProductos[p][1]).trim() === muestra.producto.trim()) { presentacion = String(dataProductos[p][3]); break; }
    }
    muestra.presentacion = presentacion;

    let nombreJefe = ""; let nombreRS = ""; let traductorNombres = {};
    for (let u = 1; u < dataUsuarios.length; u++) {
        let idLogin = String(dataUsuarios[u][3]).trim();
        let nombreReal = String(dataUsuarios[u][1]).trim();
        let rol = String(dataUsuarios[u][2]).toUpperCase();
        let estatus = String(dataUsuarios[u][5]);

        traductorNombres[idLogin] = nombreReal;
        traductorNombres[nombreReal] = nombreReal;
        if (estatus === 'Activo') {
            if (rol === 'JEFE DE CONTROL DE CALIDAD') nombreJefe = nombreReal;
            if (rol === 'RESPONSABLE SANITARIO') nombreRS = nombreReal;
        }
    }

    let res = []; let firmasFQ = new Set(); let firmasMB = new Set(); let fechaAnalisis = new Date().toISOString();
    const palabrasMicro = ['MESOFILO', 'HONGO', 'LEVADURA', 'COLI', 'SALMONELLA', 'AUREUS', 'PSEUDOMONA', 'MICROBIO', 'CUENTA', 'ENTEROBAC', 'AEROBIO'];

    if (dataResultados.length > 1) {
        for (let i = 1; i < dataResultados.length; i++) {
            let loteFilaRes = String(dataResultados[i][0]).replace(/^'/, '').trim().replace(/^0+/, '');
            if (loteFilaRes === loteAgnostico) {
                let nombrePrueba = String(dataResultados[i][1]);
                res.push({ prueba: nombrePrueba, especificacion: String(dataResultados[i][2]), resultado: String(dataResultados[i][3]).replace(/^'/, ''), evaluacion: String(dataResultados[i][4]) });

                let analistaID = String(dataResultados[i][5]);
                if (analistaID && analistaID !== 'undefined' && analistaID.trim() !== '') {
                    let analistaNombreReal = traductorNombres[analistaID] || analistaID;
                    let esPruebaMB = palabrasMicro.some(palabra => nombrePrueba.toUpperCase().includes(palabra));
                    if (esPruebaMB) firmasMB.add(analistaNombreReal); else firmasFQ.add(analistaNombreReal);
                }
                if (dataResultados[i][6] instanceof Date) fechaAnalisis = dataResultados[i][6].toISOString();
            }
        }
    }

    muestra.analistaFQ = Array.from(firmasFQ).join(' / ') || '';
    muestra.analistaMB = Array.from(firmasMB).join(' / ') || '';
    return { success: true, muestra: muestra, resultados: res, fechaAnalisis: fechaAnalisis, jefe: nombreJefe, rs: nombreRS };
}


function generarPDFMasivoEnServidor(lotesArray, usuarioSolicitante) {
    try {
        const rolesFirma = ['Jefe de Control de Calidad', 'Supervisor', 'Responsable Sanitario', 'Gerente', 'Administrador'];
        if (!verificarPermisoBackend(usuarioSolicitante, rolesFirma)) {
            registrarAuditTrail(usuarioSolicitante, 'Seguridad', 'Violación de Acceso', `Intento denegado de emisión de CoAs.`);
            throw new Error("Bloqueo CFR 21: No tiene permisos de nivel jerárquico para emitir documentos oficiales.");
        }

        if (!Array.isArray(lotesArray)) lotesArray = [lotesArray];
        if (lotesArray.length === 0 || !lotesArray[0]) throw new Error("No se seleccionaron lotes.");

        const datosMasivos = obtenerDatosCertificadosMasivo(lotesArray);
        if (!datosMasivos.success) throw new Error(datosMasivos.error);
        const certificados = datosMasivos.certificados;

        const pdfBlobs = [];
        const hoy = new Date();
        const fLiberacion = formatearFechaEspanol(hoy.toISOString());

        certificados.forEach((certData) => {
            const m = certData.muestra;
            const tituloCert = m.tipoAnalisis === 'Estabilidad' ? 'CERTIFICADO DE ANÁLISIS DE ESTABILIDAD' : 'CERTIFICADO DE ANÁLISIS DE PRODUCTO TERMINADO';

            let fMuestreo = formatearFechaEspanol(m.fechaIngreso);
            let fAnalisis = formatearFechaEspanol(certData.fechaAnalisis);

            let caducidad = '';
            const fIng = new Date(m.fechaIngreso);
            if (!isNaN(fIng)) {
                fIng.setFullYear(fIng.getFullYear() + 2);
                caducidad = formatearFechaEspanol(fIng.toISOString());
            }

            let analistaFQ = m.analistaFQ || ''; let analistaMB = m.analistaMB || '';
            let nombreJefe = certData.jefe || "No asignado"; let nombreRS = certData.rs || "No asignado";

            let filasResultados = '';
            certData.resultados.forEach(res => {
                let claseOOS = res.evaluacion === 'OOS' ? 'oos' : '';
                filasResultados += `
        <tr class="avoid-break">
          <td class="left">${res.prueba}</td>
          <td>${res.especificacion}</td>
          <td class="${claseOOS}">${res.resultado}</td>
        </tr>`;
            });

            let logoDataUrl = obtenerLogoBase64();
            let imgSrc = logoDataUrl ? `src="${logoDataUrl}"` : '';

            let html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 10px; color: black; margin: 0; padding: 0; }
          .avoid-break { page-break-inside: avoid; }
          .header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 10px; margin-bottom: 15px; }
          h1 { font-size: 16px; color: #064e3b; margin: 0 0 5px 0; font-weight: bold; }
          h2 { font-size: 13px; margin: 0; }
          .info-table { width: 100%; margin-bottom: 15px; font-size: 10px; border-collapse: collapse; }
          .info-table td { padding: 4px; vertical-align: bottom; }
          .border-b { border-bottom: 1px solid black; display: inline-block; width: 100%; text-align: center; }
          .results-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10px; }
          .results-table th { background-color: #f3f4f6; border: 1px solid black; padding: 5px; }
          .results-table td { border: 1px solid black; padding: 5px; text-align: center; }
          .results-table td.left { text-align: left; font-weight: bold; }
          .oos { font-weight: bold; background-color: #e5e7eb; }
          .firmas-table { width: 100%; margin-top: 30px; text-align: center; page-break-inside: avoid; border-collapse: collapse; }
          .firmas-table td { width: 50%; padding-top: 25px; padding-bottom: 10px; }
          .linea-firma { border-bottom: 1px solid black; width: 180px; margin: 0 auto; position: relative; height: 20px; }
          .nombre-analista { position: absolute; bottom: 2px; left: 0; width: 100%; text-align: center; font-style: italic; color: #1e40af; font-family: serif; font-size: 11px; }
          .titulo-firma { font-weight: bold; font-size: 10px; margin-top: 4px; display: block; }
          .fecha-firma { font-size: 9px; color: #374151; display: block; margin-top: 2px; }
        </style>
      </head>
      <body>
        <div style="padding: 10mm;">
          <div class="header">
            <div style="text-align: center; margin-bottom: 15px;">
              <img ${imgSrc} height="70" style="height: 70px; width: auto;">
            </div>
            
            <h1>SORIA NATURAL, S. A. DE C. V.</h1>
            <h2>${tituloCert}</h2>
          </div>
          <table class="info-table">
            <tr><td colspan="2"><b>Nombre comercial:</b><br><span class="border-b">${m.producto}</span></td></tr>
            <tr>
              <td><b>No. Lote:</b><br><span class="border-b">${m.loteInterno}</span></td>
              <td><b>Presentación:</b><br><span class="border-b">${m.presentacion || 'No especificada'}</span></td>
            </tr>
            <tr>
              <td><b>Fecha de muestreo:</b><br><span class="border-b">${fMuestreo}</span></td>
              <td><b>Fecha de análisis:</b><br><span class="border-b">${fAnalisis}</span></td>
            </tr>
            <tr>
              <td><b>Número de análisis:</b><br><span class="border-b">${m.numAnalisis}</span></td>
              <td><b>Fecha Caducidad:</b><br><span class="border-b">${caducidad}</span></td>
            </tr>
          </table>
          <table class="results-table">
            <thead><tr><th>Análisis</th><th>Especificación</th><th>Resultado</th></tr></thead>
            <tbody>${filasResultados}</tbody>
          </table>
          <div class="avoid-break">
            <p>Se hace constar que el análisis practicado al <b>${m.producto}</b>, llena los estándares requeridos y por lo tanto se extiende el presente certificado.</p>
            <p><b>Dictamen:</b> <span style="border-bottom: 1px solid black; padding: 0 10px;">${m.estatus === 'Liberado' ? 'Aprobado (Cumple con especificaciones)' : 'Rechazado (Fuera de especificaciones)'}</span></p>
          </div>
          <table class="firmas-table">
            <tr>
              <td><div class="linea-firma"><span class="nombre-analista">${analistaFQ}</span></div><span class="titulo-firma">Analista Fisicoquímico</span><span class="fecha-firma">Fecha: ${fLiberacion}</span></td>
              <td><div class="linea-firma"><span class="nombre-analista">${analistaMB}</span></div><span class="titulo-firma">Analista Microbiológico</span><span class="fecha-firma">Fecha: ${fLiberacion}</span></td>
            </tr>
            <tr>
              <td><div class="linea-firma"><span class="nombre-analista">${nombreJefe}</span></div><span class="titulo-firma">Jefe de Control de Calidad</span><span class="fecha-firma">Fecha: ${fLiberacion}</span></td>
              <td><div class="linea-firma"><span class="nombre-analista">${nombreRS}</span></div><span class="titulo-firma">Responsable Sanitario</span><span class="fecha-firma">Fecha: ${fLiberacion}</span></td>
            </tr>
          </table>
        </div>
      </body>
      </html>`;

            const nombreArchivo = `CoA_${m.producto}_Lote-${m.loteInterno}.pdf`.replace(/\s+/g, '_');
            pdfBlobs.push(HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(nombreArchivo));
        });

        const anioActual = hoy.getFullYear().toString();
        const meses = ['01-Ene', '02-Feb', '03-Mar', '04-Abr', '05-May', '06-Jun', '07-Jul', '08-Ago', '09-Sep', '10-Oct', '11-Nov', '12-Dic'];
        const mesActualFolder = meses[hoy.getMonth()];

        let carpetaRaiz = obtenerOCrearCarpeta(DriveApp, "LIMS_Certificados_Emitidos");
        let carpetaAnio = obtenerOCrearCarpeta(carpetaRaiz, anioActual);
        let carpetaDestino = obtenerOCrearCarpeta(carpetaAnio, mesActualFolder);

        let urlRespuesta = carpetaDestino.getUrl();
        let archivosCreados = [];

        pdfBlobs.forEach(blob => {
            const archivoPDF = carpetaDestino.createFile(blob);
            archivoPDF.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            archivosCreados.push(archivoPDF.getUrl());
        });

        if (archivosCreados.length === 1) { urlRespuesta = archivosCreados[0]; }

        const detalleAudit = pdfBlobs.length === 1
            ? `Emisión de CoA Individual - Lote: ${certificados[0].muestra.loteInterno}`
            : `Emisión Masiva de CoAs - Cantidad: ${pdfBlobs.length} lotes`;

        registrarAuditTrail(usuarioSolicitante, 'Reportes', 'Generación PDF', detalleAudit);

        return { success: true, url: urlRespuesta, mensaje: `${pdfBlobs.length} certificado(s) generado(s) correctamente.` };

    } catch (e) { return { success: false, error: e.message }; }
}

function obtenerOCrearCarpeta(parent, nombre) {
    const iterador = parent.getFoldersByName(nombre);
    return iterador.hasNext() ? iterador.next() : parent.createFolder(nombre);
}

function obtenerAlertasCaducidad() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const hoy = new Date();
    let alertas = [];

    const revisarHoja = (nombreHoja, colLote, colNombre, colCad, colEst, categoria, diasVentana) => {
        const sheet = ss.getSheetByName(nombreHoja);
        if (!sheet) return;
        const data = sheet.getDataRange().getValues();
        const limiteAlert = new Date(); limiteAlert.setDate(hoy.getDate() + diasVentana);

        for (let i = 1; i < data.length; i++) {
            let cadVal = data[i][colCad]; const est = String(data[i][colEst]);
            if (!cadVal || est === 'Agotado' || est === 'Inactiva' || est === 'Rechazado' || est === 'Caducado') continue;
            let fechaCad = new Date(cadVal);
            if (fechaCad.getFullYear() < 2000) fechaCad.setFullYear(fechaCad.getFullYear() + 100);

            if (fechaCad <= limiteAlert) {
                alertas.push({
                    lote: data[i][colLote], nombre: data[i][colNombre], caducidad: fechaCad.toISOString(), categoria: categoria,
                    diasRestantes: Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24))
                });
            }
        }
    };

    revisarHoja('INV_RECEPCION', 4, 2, 8, 13, 'Insumo Prov.', 90);
    revisarHoja('INV_PREPARACION', 0, 3, 7, 8, 'Preparación', 7);
    revisarHoja('INV_CEPAS', 2, 1, 6, 8, 'Cepa/Pase', 30);
    revisarHoja('EQUIPOS_CALIBRACION', 0, 1, 6, 7, 'Calibración Equipo', 45);

    return alertas.sort((a, b) => new Date(a.caducidad) - new Date(b.caducidad));
}

function obtenerAuditTrailBD() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName('AUDIT_TRAIL');
        if (!sheet) throw new Error("Hoja AUDIT_TRAIL no encontrada.");

        const data = sheet.getDataRange().getDisplayValues();
        if (data.length <= 1) return [];

        return data.slice(1).reverse().map(f => ({
            fecha: String(f[0]), usuario: String(f[1]), modulo: String(f[2]), accion: String(f[3]), detalle: String(f[4])
        }));
    } catch (e) { return { error: e.message }; }
}

function doGet(e) {
    return HtmlService.createTemplateFromFile('Index')
        .evaluate()
        .setTitle('LIMS Herbolaria')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * ============================================================================
 * 8. MÓDULO DE INTELIGENCIA Y CALIDAD: KPIs Y RAP (NOM-059 / 248)
 * ============================================================================
 */

function obtenerDatosInteligenciaKPI() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const dataMuestras = ss.getSheetByName('MUESTRAS').getDataRange().getValues();
        const dataResultados = ss.getSheetByName('RESULTADOS_ANALISIS').getDataRange().getValues();

        // Filtramos para ignorar encabezados
        const muestras = dataMuestras.slice(1);
        const resultados = dataResultados.slice(1);

        // --- 1. CÁLCULO DE ÍNDICE DE RECHAZOS (Scrap Rate) ---
        let lotesTotales = muestras.length;
        let lotesRechazados = muestras.filter(m => String(m[4]).trim() === 'Rechazado').length;
        let tasaRechazo = lotesTotales > 0 ? ((lotesRechazados / lotesTotales) * 100).toFixed(2) : 0;

        // --- 2. CÁLCULO DE RIGHT FIRST TIME (RFT) / OOS RATE ---
        let totalPruebas = resultados.length;
        let pruebasCumple = resultados.filter(r => String(r[4]).trim() === 'Cumple').length;
        let pruebasOOS = resultados.filter(r => String(r[4]).trim() === 'OOS').length;
        let tasaRFT = totalPruebas > 0 ? ((pruebasCumple / totalPruebas) * 100).toFixed(2) : 0;

        // --- 3. TOP 5 PRUEBAS CRÍTICAS (Pareto de OOS) ---
        let conteoOOS = {};
        resultados.forEach(r => {
            if (String(r[4]).trim() === 'OOS') {
                let prueba = String(r[1]).trim();
                conteoOOS[prueba] = (conteoOOS[prueba] || 0) + 1;
            }
        });

        // Ordenar de mayor a menor y sacar el Top 5
        let topOOS = Object.keys(conteoOOS)
            .map(key => ({ prueba: key, cantidad: conteoOOS[key] }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        // --- 4. LEAD TIME (Tiempo Promedio de Liberación) ---
        let totalDias = 0; let lotesLiberadosCount = 0;

        muestras.forEach(m => {
            let estatus = String(m[4]).trim();
            if (estatus === 'Liberado' || estatus === 'Rechazado') {
                let fIngreso = new Date(m[5]);
                let loteInterno = String(m[0]).replace(/^'/, '').trim().replace(/^0+/, '');

                // Buscar la fecha del último resultado de este lote
                let resultadosLote = resultados.filter(r => String(r[0]).replace(/^'/, '').trim().replace(/^0+/, '') === loteInterno);
                if (resultadosLote.length > 0 && !isNaN(fIngreso)) {
                    // Obtener la fecha máxima de análisis
                    let fUltimoAnalisis = new Date(Math.max(...resultadosLote.map(r => new Date(r[6]))));
                    if (!isNaN(fUltimoAnalisis)) {
                        let diffTiempo = fUltimoAnalisis.getTime() - fIngreso.getTime();
                        let diffDias = diffTiempo / (1000 * 3600 * 24);
                        if (diffDias >= 0) { totalDias += diffDias; lotesLiberadosCount++; }
                    }
                }
            }
        });

        let leadTimePromedio = lotesLiberadosCount > 0 ? (totalDias / lotesLiberadosCount).toFixed(1) : 0;

        return {
            success: true,
            kpis: {
                lotesTotales, lotesRechazados, tasaRechazo,
                totalPruebas, pruebasOOS, tasaRFT,
                leadTimePromedio, topOOS
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function compilarDatosRAP(productoSeleccionado, anioSeleccionado) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const dataMuestras = ss.getSheetByName('MUESTRAS').getDataRange().getValues();
        const dataResultados = ss.getSheetByName('RESULTADOS_ANALISIS').getDataRange().getValues();

        // 1. Filtrar los lotes del producto y año específico
        let lotesAnalizados = [];
        let conteoLotes = { totales: 0, aprobados: 0, rechazados: 0, enProceso: 0 };

        dataMuestras.slice(1).forEach(m => {
            let producto = String(m[1]).trim();
            let fIngreso = new Date(m[5]);
            let anioMuestra = fIngreso.getFullYear().toString();

            if (producto === productoSeleccionado && anioMuestra === anioSeleccionado) {
                let loteLimpio = String(m[0]).replace(/^'/, '').trim();
                let estatus = String(m[4]).trim();

                lotesAnalizados.push({ lote: loteLimpio, estatus: estatus });
                conteoLotes.totales++;
                if (estatus === 'Liberado') conteoLotes.aprobados++;
                else if (estatus === 'Rechazado') conteoLotes.rechazados++;
                else conteoLotes.enProceso++;
            }
        });

        if (conteoLotes.totales === 0) {
            return { success: false, error: `No se encontraron lotes para ${productoSeleccionado} en el año ${anioSeleccionado}.` };
        }

        // 2. Extraer tendencias de los resultados (Solo de los lotes encontrados)
        let lotesIDs = lotesAnalizados.map(l => l.lote.replace(/^0+/, '')); // Array de IDs agnósticos (sin ceros)
        let dataTendencias = {};
        let listaOOS = [];

        dataResultados.slice(1).forEach(r => {
            let loteRes = String(r[0]).replace(/^'/, '').trim().replace(/^0+/, '');
            if (lotesIDs.includes(loteRes)) {
                let prueba = String(r[1]).trim();
                let especificacion = String(r[2]).trim();
                let resultadoRaw = String(r[3]).replace(/^'/, '').trim();
                let evaluacion = String(r[4]).trim();

                // Registrar OOS
                if (evaluacion === 'OOS') {
                    listaOOS.push({ lote: loteRes, prueba: prueba, resultado: resultadoRaw, especificacion: especificacion });
                }

                // Limpiar resultado para sacar valor numérico (Remover <, >, ≤, y comas)
                let valorNumerico = parseFloat(resultadoRaw.replace(/[<>\s≤≥,]/g, ''));

                // Solo calcular tendencias si es un valor numérico real
                if (!isNaN(valorNumerico) && resultadoRaw.toLowerCase() !== 'ausencia' && resultadoRaw.toLowerCase() !== 'cumple con la prueba') {
                    if (!dataTendencias[prueba]) {
                        dataTendencias[prueba] = { especificacion: especificacion, valores: [] };
                    }
                    dataTendencias[prueba].valores.push(valorNumerico);
                }
            }
        });

        // 3. Calcular Min, Max y Promedio por prueba
        let reporteTendencias = [];
        Object.keys(dataTendencias).forEach(prueba => {
            let arr = dataTendencias[prueba].valores;
            if (arr.length > 0) {
                let min = Math.min(...arr);
                let max = Math.max(...arr);
                let sum = arr.reduce((a, b) => a + b, 0);
                let avg = (sum / arr.length).toFixed(2);

                reporteTendencias.push({
                    prueba: prueba,
                    especificacion: dataTendencias[prueba].especificacion,
                    n_datos: arr.length,
                    min: min,
                    max: max,
                    promedio: avg
                });
            }
        });

        return {
            success: true,
            producto: productoSeleccionado,
            anio: anioSeleccionado,
            resumenLotes: conteoLotes,
            tendencias: reporteTendencias,
            desviacionesOOS: listaOOS
        };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

function include(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function obtenerLogoBase64() {
    if (!LOGO_BASE64 || LOGO_BASE64 === '') return '';
    return "data:image/png;base64," + LOGO_BASE64.replace(/[\r\n\t\s]/g, "");
}