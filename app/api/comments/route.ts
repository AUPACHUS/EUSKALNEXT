import { openDb } from '@/lib/database';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { author, content } = await request.json();

    // Validación básica de entrada (puedes expandirla o usar una librería)
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return NextResponse.json({ message: 'El autor es obligatorio.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ message: 'El contenido es obligatorio.' }, { status: 400 });
    }

    const db = await openDb();

    // Guardar en SQLite
    try {
      await db.run(
        'INSERT INTO comments (author, content, approved) VALUES (?, ?, ?)',
        [author.trim(), content.trim(), false]
      );
    } catch (dbError) {
      console.error('Error al guardar el comentario en la base de datos:', dbError);
      return NextResponse.json({ message: 'Error interno al guardar el comentario.' }, { status: 500 });
    }

    // Enviar correo de aprobación
    // Es MUY RECOMENDABLE usar variables de entorno para las credenciales y el email de destino
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const mailTo = process.env.MAIL_TO_ADMIN;

    if (!mailUser || !mailPass || !mailTo) {
      console.error('Faltan variables de entorno para la configuración del correo.');
      // Podrías decidir si esto es un error crítico o si el comentario se guarda igualmente
      // Por ahora, devolvemos éxito pero advertimos en el servidor.
      return NextResponse.json({ message: 'Comentario enviado, pero ocurrió un problema al notificar.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // O el servicio que uses
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    try {
      await transporter.sendMail({
        to: mailTo,
        subject: 'Nuevo comentario para aprobar',
        html: `<p>Autor: ${author}</p><p>Contenido: ${content}</p>`,
      });
    } catch (mailError) {
      console.error('Error al enviar el correo de notificación:', mailError);
      // El comentario ya se guardó, así que podrías decidir no fallar la petición completa
      // pero sí registrar el error.
    }

    return NextResponse.json({ message: 'Comentario enviado para aprobación' });
  } catch (error) {
    console.error('Error general en la API de comentarios:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}