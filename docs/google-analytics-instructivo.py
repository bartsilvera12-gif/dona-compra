# -*- coding: utf-8 -*-
"""Instructivo para Antonio: como crear la propiedad de Google Analytics.

El estilo esta repetido a proposito con cambiar-el-video-instructivo.py. Son
dos archivos sueltos que alguien puede correr sin preparar nada; compartir el
estilo en un tercer archivo obligaria a tocar sys.path para correrlos. Si
algun dia hay un cuarto instructivo, conviene juntarlos.

    python -I docs/google-analytics-instructivo.py
"""
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

VERDE = colors.HexColor('#163923')
TINTA = colors.HexColor('#2F4237')
SUAVE = colors.HexColor('#4F5C54')
CREMA = colors.HexColor('#F5F2EB')
OCRE = colors.HexColor('#DE9B2B')

SALIDA = 'docs/google-analytics-instructivo.pdf'

H1 = ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=23, leading=27,
                    textColor=VERDE, spaceAfter=4)
SUB = ParagraphStyle('SUB', fontName='Helvetica', fontSize=9.5, leading=13,
                     textColor=SUAVE, spaceAfter=16)
H2 = ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=12.5, leading=16,
                    textColor=VERDE, spaceBefore=11, spaceAfter=5,
                    keepWithNext=1)
P = ParagraphStyle('P', fontName='Helvetica', fontSize=10.2, leading=14.6,
                   textColor=TINTA, alignment=TA_LEFT, spaceAfter=6)
LI = ParagraphStyle('LI', parent=P, leftIndent=13, bulletIndent=1, spaceAfter=5)
NOTA = ParagraphStyle('NOTA', fontName='Helvetica', fontSize=9.8, leading=14,
                      textColor=TINTA, spaceAfter=6)
PIE = ParagraphStyle('PIE', fontName='Helvetica', fontSize=8.6, leading=12,
                     textColor=SUAVE)


def recuadro(parrafos, fondo=CREMA, borde=OCRE):
    t = Table([[parrafos]], colWidths=[158 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), fondo),
        ('BOX', (0, 0), (-1, -1), 0.9, borde),
        ('LEFTPADDING', (0, 0), (-1, -1), 11),
        ('RIGHTPADDING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


def pie(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(OCRE)
    canvas.setLineWidth(1.6)
    canvas.line(26 * mm, A4[1] - 18 * mm, 58 * mm, A4[1] - 18 * mm)
    canvas.setFont('Helvetica', 8.2)
    canvas.setFillColor(SUAVE)
    canvas.drawString(26 * mm, 14 * mm, 'Doña Compra · Google Analytics')
    canvas.drawRightString(184 * mm, 14 * mm, 'Página %d' % doc.page)
    canvas.restoreState()


doc = BaseDocTemplate(SALIDA, pagesize=A4,
                      leftMargin=26 * mm, rightMargin=26 * mm,
                      topMargin=21 * mm, bottomMargin=20 * mm,
                      title='Google Analytics para doñacompra.com',
                      author='Neura', subject='Instructivo para Antonio Ferreira')
marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='c')
doc.addPageTemplates([PageTemplate(id='p', frames=[marco], onPage=pie)])

h = []
h.append(Paragraph('Google Analytics', H1))
h.append(Paragraph(
    'Para doñacompra.com &nbsp;·&nbsp; Antonio Ferreira '
    '&nbsp;·&nbsp; Noviembre de 2026', SUB))

h.append(Paragraph(
    'El sitio ya está preparado para medir: el código está puesto '
    'y espera un identificador. Lo único que falta es crear la propiedad, '
    'y conviene que la crees vos, en tu cuenta de Google, para que quede a tu '
    'nombre desde el primer día. Al final nos pasás un código y la '
    'conectamos nosotros.', P))

h.append(Paragraph('1 &nbsp;·&nbsp; Crear la propiedad', H2))
for n, t in [
    ('1.', 'Entrá a <b>analytics.google.com</b> con tu cuenta de Google.'),
    ('2.', 'Abajo a la izquierda, el engranaje de <b>Administrar</b>. '
           'Después <b>Crear</b> y <b>Propiedad</b>.'),
    ('3.', 'Nombre: <b>Doña Compra</b>. Zona horaria: <b>Paraguay</b>. '
           'Moneda: <b>Guaraní</b>.'),
    ('4.', 'Te va a preguntar por el tamaño del negocio y tus objetivos. '
           'No condicionan nada: contéstalo y seguí.'),
    ('5.', 'Cuando pregunte la plataforma, elegí <b>Web</b>.'),
    ('6.', 'URL del sitio: <b>doñacompra.com</b>. Nombre del flujo: '
           '<b>Sitio Doña Compra</b>.'),
]:
    h.append(Paragraph(t, LI, bulletText=n))

h.append(Paragraph('2 &nbsp;·&nbsp; Copiar el ID de medición', H2))
h.append(Paragraph(
    'Al terminar, Google muestra un <b>ID de medición</b> que empieza con '
    '<b>G-</b> y sigue con letras y números. Ese es el único dato que '
    'necesitamos.', P))
h.append(Paragraph(
    'Si cerraste la pantalla, está siempre en <b>Administrar</b> → '
    '<b>Flujos de datos</b>, entrando al flujo que acabás de crear.', P))

h.append(Paragraph('3 &nbsp;·&nbsp; Pasánoslo', H2))
h.append(Paragraph(
    'Mandanos ese <b>G-…</b> y lo conectamos al sitio. Es menos de un '
    'minuto de nuestro lado, y te avisamos cuando esté midiendo.', P))

h.append(Paragraph('4 &nbsp;·&nbsp; Darnos acceso (si querés)', H2))
h.append(Paragraph(
    'No hace falta para que mida; sirve si querés que miremos los informes '
    'con vos. En <b>Administrar</b> → <b>Accesos a la propiedad</b> '
    '→ <b>+</b>, agregá nuestro correo con el rol <b>Lector</b>. La '
    'propiedad sigue siendo tuya y podés sacarnos el acceso cuando '
    'quieras.', P))

h.append(Paragraph('5 &nbsp;·&nbsp; Comprobar que mide', H2))
h.append(Paragraph(
    'Entrá a <b>doñacompra.com</b> desde tu teléfono y '
    '<b>aceptá todas las cookies</b> cuando aparezca el aviso. '
    'Después, en Analytics, andá a <b>Informes</b> → <b>Tiempo '
    'real</b>: tenés que verte a vos mismo en el mapa.', P))

h.append(Spacer(1, 2))
h.append(recuadro([
    Paragraph('<b>Dos cosas para tener en cuenta</b>', NOTA),
    Paragraph('<b>Los números van a estar por debajo de las visitas '
              'reales.</b> Solo se cuenta a quien acepta las cookies de '
              'medición. No es un error: es lo que exige el aviso de '
              'privacidad que ya tiene el sitio.', NOTA),
    Paragraph('<b>No hay historia hacia atrás.</b> Analytics empieza a '
              'guardar el día que se enciende, no antes. Si para la '
              'revisión de enero querés ver cómo fueron las '
              'primeras semanas, conviene crearla ahora.', NOTA),
]))

h.append(Spacer(1, 11))
h.append(Paragraph(
    'Google le cambia el nombre a los botones cada tanto. Si alguno no '
    'coincide exactamente con lo que dice acá, el camino es el mismo: '
    'crear una propiedad, elegir Web, y copiar el ID que empieza con G-.', PIE))

doc.build(h)
print('listo:', SALIDA)
