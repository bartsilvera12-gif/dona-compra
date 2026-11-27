# -*- coding: utf-8 -*-
"""Instructivo para Irama: como cambiar el video desde el panel."""
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate,
                                Paragraph, Spacer, Table, TableStyle)

VERDE = colors.HexColor('#163923')
OCRE = colors.HexColor('#875F1A')
TINTA = colors.HexColor('#2F4237')
SUAVE = colors.HexColor('#4F5C54')
CREMA = colors.HexColor('#F5F2EB')

SALIDA = 'docs/cambiar-el-video-instructivo.pdf'

H1 = ParagraphStyle('H1', fontName='Helvetica-Bold', fontSize=23, leading=27,
                    textColor=VERDE, spaceAfter=4)
SUB = ParagraphStyle('SUB', fontName='Helvetica', fontSize=9.5, leading=13,
                     textColor=SUAVE, spaceAfter=18)
H2 = ParagraphStyle('H2', fontName='Helvetica-Bold', fontSize=12.5, leading=16,
                    textColor=VERDE, spaceBefore=15, spaceAfter=6, keepWithNext=1)
P = ParagraphStyle('P', fontName='Helvetica', fontSize=10.3, leading=15.2,
                   textColor=TINTA, alignment=TA_LEFT, spaceAfter=7)
LI = ParagraphStyle('LI', parent=P, leftIndent=11, bulletIndent=1, spaceAfter=5)
NOTA = ParagraphStyle('NOTA', fontName='Helvetica', fontSize=9.8, leading=14,
                      textColor=TINTA, spaceAfter=7)
PIE = ParagraphStyle('PIE', fontName='Helvetica', fontSize=8.6, leading=11,
                     textColor=SUAVE)


def recuadro(parrafos, fondo=CREMA, borde=colors.HexColor('#DE9B2B')):
    """Un bloque con fondo, para lo que hay que mirar dos veces."""
    celda = [[parrafos]]
    t = Table(celda, colWidths=[158 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), fondo),
        ('BOX', (0, 0), (-1, -1), 0.9, borde),
        ('LEFTPADDING', (0, 0), (-1, -1), 11),
        ('RIGHTPADDING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


def pie(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#DE9B2B'))
    canvas.setLineWidth(1.6)
    canvas.line(26 * mm, A4[1] - 18 * mm, 58 * mm, A4[1] - 18 * mm)
    canvas.setFont('Helvetica', 8.2)
    canvas.setFillColor(SUAVE)
    canvas.drawString(26 * mm, 14 * mm,
                      'Doña Compra · Instructivo del panel')
    canvas.drawRightString(184 * mm, 14 * mm, 'Página %d' % doc.page)
    canvas.restoreState()


doc = BaseDocTemplate(SALIDA, pagesize=A4,
                      leftMargin=26 * mm, rightMargin=26 * mm,
                      topMargin=26 * mm, bottomMargin=22 * mm,
                      title='Cómo cambiar el video de Doña',
                      author='Neura', subject='Instructivo para Irama')
marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='c')
doc.addPageTemplates([PageTemplate(id='p', frames=[marco], onPage=pie)])

h = []
h.append(Paragraph('Cómo cambiar el video de Doña', H1))
h.append(Paragraph(
    'Para Irama &nbsp;·&nbsp; Panel de Doña Compra '
    '&nbsp;·&nbsp; Noviembre de 2026', SUB))

h.append(Paragraph('Antes de empezar', H2))
h.append(Paragraph('Vas a necesitar dos archivos:', P))
h.append(Paragraph(
    '<b>El video</b>, en mp4, de hasta 25 MB. Un minuto en vertical, bien '
    'exportado, pesa entre 5 y 10 MB.', LI, bulletText='•'))
h.append(Paragraph(
    '<b>La portada</b>, en jpg o png: es el cuadro que se ve antes de que '
    'alguien le dé play. Lo más práctico es exportar un '
    'fotograma del propio video.', LI, bulletText='•'))
h.append(Spacer(1, 7))
h.append(recuadro([
    Paragraph('<b>Dos cosas para revisar antes de exportar</b>', NOTA),
    Paragraph('El video va <b>vertical, en 9:16</b>. Es la proporción con '
              'la que está armado el espacio en la página.', NOTA),
    Paragraph('Los subtítulos van <b>dentro</b> del video, no se agregan '
              'después. Leelos completos antes de exportar: el del primer '
              'fragmento es el que hay que corregir.', NOTA),
]))

h.append(Paragraph('1 &nbsp;·&nbsp; Entrar al panel', H2))
h.append(Paragraph(
    'Abrí <b>doñacompra.com/admin</b> e ingresá con tu usuario '
    'y tu contraseña. Si no los tenés, pedíselos a Karen.', P))

h.append(Paragraph('2 &nbsp;·&nbsp; Buscar el video', H2))
h.append(Paragraph(
    'Entrá a <b>Contenido de la página</b>. Arriba hay dos '
    'desplegables: en <b>Página</b> elegí <b>Inicio</b>, y en '
    '<b>Sección</b>, «Mejor que te lo cuente ella». '
    'También podés escribir <b>video</b> en el buscador.', P))
h.append(Paragraph(
    'Vas a ver un campo marcado <b>Video</b>, con la portada de ahora a la '
    'izquierda y dos botones para elegir archivo a la derecha.', P))

h.append(Paragraph('3 &nbsp;·&nbsp; Cambiar los dos archivos', H2))
h.append(Paragraph(
    'En <b>El video</b>, elegí tu mp4 y esperá a que el cartelito '
    'de abajo diga «Listo». Después, en <b>La portada</b>, '
    'elegí tu jpg.', P))
h.append(Spacer(1, 3))
h.append(recuadro([
    Paragraph('<b>Cambiá siempre los dos.</b> Si cambiás solo el '
              'video, la página sigue mostrando el cuadro viejo antes del '
              'play y parece que no hubiera pasado nada.', NOTA),
]))

h.append(Paragraph('4 &nbsp;·&nbsp; Guardar', H2))
h.append(Paragraph(
    'Apretá <b>Guardar contenido</b>, abajo de todo. Hasta que no '
    'guardes, el cambio no se ve en el sitio.', P))

h.append(Paragraph('5 &nbsp;·&nbsp; Comprobar', H2))
h.append(Paragraph(
    'Abrí <b>doñacompra.com</b> en otra pestaña y bajá '
    'hasta «Mejor que te lo cuente ella». Dale play y escuchá '
    'el primer fragmento, mirando los subtítulos.', P))
h.append(Paragraph(
    'Si todavía ves el video anterior, recargá la página con '
    '<b>Ctrl + F5</b> (en Mac, <b>Cmd + Shift + R</b>): tu navegador se la '
    'había guardado.', P))

h.append(Paragraph('Si algo sale mal', H2))
h.append(Paragraph(
    '<b>«No se pudo subir el video».</b> Casi siempre es el peso. '
    'Comprimilo y probá de nuevo.', LI, bulletText='•'))
h.append(Paragraph(
    '<b>Te equivocaste de archivo.</b> El botón <b>Volver al original</b> '
    'deja el video como estaba. Funciona antes y después de guardar.', LI,
    bulletText='•'))
h.append(Paragraph(
    '<b>No se rompe nada.</b> El tamaño y la posición del video los '
    'sigue poniendo la página: un video nuevo entra en el mismo hueco que '
    'el de ahora.', LI, bulletText='•'))

h.append(Spacer(1, 14))
h.append(Paragraph(
    'Cualquier duda, escribile a Karen antes de guardar. Nada de esto es '
    'urgente y todo se puede deshacer.', PIE))

doc.build(h)
print('listo:', SALIDA)
