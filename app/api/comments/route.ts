import { openDb } from '@/lib/database';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { author, content } = await request.json();
  const db = await openDb();

  // Guardar en SQLite
  await db.run(
    'INSERT INTO comments (author, content, approved) VALUES (?, ?, ?)',
    [author, content, false]
  );

  // Enviar correo de aprobación (configura tu SMTP)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'artemugiocursojava@gmail.com',
      pass: 'tu_contraseña',
    },
  });

  await transporter.sendMail({
    to: 'artemugiocursojava@gmail.com',
    subject: 'Nuevo comentario para aprobar',
    html: `<p>Autor: ${author}</p><p>Contenido: ${content}</p>`,
  });

  return NextResponse.json({ message: 'Comentario enviado para aprobación' });
}