<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Restablece tu contrasena - GameWolf</title>
</head>
<body style="margin:0; padding:0; background:#f3f6ff; color:#182033; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6ff; padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden;">
                    <tr>
                        <td style="padding:28px 32px; background:#121b45; color:#ffffff;">
                            <p style="margin:0; font-size:13px; font-weight:700; letter-spacing:1.5px; color:#80a7ff;">GAMEWOLF</p>
                            <h1 style="margin:8px 0 0; font-size:28px; line-height:1.2;">Restablece tu contrasena</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px; font-size:16px; line-height:1.6;">
                            <p style="margin:0 0 16px;">Hola, <strong>{{ $usuario->nombre }}</strong>.</p>
                            <p style="margin:0 0 24px;">Recibimos una solicitud para cambiar la contrasena de tu cuenta. Usa este enlace seguro para definir una nueva contrasena:</p>
                            <p style="margin:0 0 24px; text-align:center;">
                                <a href="{{ $urlRestablecimiento }}" style="display:inline-block; padding:13px 22px; border-radius:8px; background:#5b42f3; color:#ffffff; font-weight:700; text-decoration:none;">Restablecer mi contrasena</a>
                            </p>
                            <p style="margin:0 0 16px; color:#65708a; font-size:14px;">El enlace vence en 60 minutos y solo puede usarse una vez.</p>
                            <p style="margin:0; color:#65708a; font-size:13px;">Si no solicitaste este cambio, ignora este correo. Tu contrasena actual seguira siendo valida.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px; background:#f7f8fc; color:#65708a; font-size:12px; text-align:center;">
                            Correo automatico de GameWolf. No compartas este enlace con nadie.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
