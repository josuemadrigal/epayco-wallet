import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar transportador de email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPaymentToken(
    email: string,
    nombre: string,
    token: string,
    monto: number,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"ecoWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔐 Código de confirmación de pago - ecoWallet',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
              }
              .greeting {
                font-size: 18px;
                color: #333;
                margin-bottom: 20px;
              }
              .token-box {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
              }
              .token {
                font-size: 48px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #ffffff;
                font-family: 'Courier New', monospace;
              }
              .token-label {
                color: #ffffff;
                font-size: 14px;
                margin-top: 10px;
                opacity: 0.9;
              }
              .info-box {
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 20px 0;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
                color: #667eea;
              }
              .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💳 ecoWallet</h1>
              </div>
              
              <div class="content">
                <p class="greeting">Hola <strong>${nombre}</strong>,</p>
                
                <p>Has iniciado un proceso de pago. Para completar la transacción, necesitamos que confirmes usando el siguiente código:</p>
                
                <div class="token-box">
                  <div class="token">${token}</div>
                  <div class="token-label">CÓDIGO DE CONFIRMACIÓN</div>
                </div>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>Monto a pagar:</strong></p>
                  <p class="amount">$${monto.toLocaleString()}</p>
                </div>
                
                <div class="warning">
                  <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Este código expira en <strong>10 minutos</strong></li>
                    <li>No compartas este código con nadie</li>
                    <li>Si no solicitaste este pago, ignora este correo</li>
                  </ul>
                </div>
                
                <p>Ingresa este código en la aplicación para completar tu pago.</p>
                
                <p style="margin-top: 30px;">Si tienes alguna duda, no dudes en contactarnos.</p>
                
                <p>Saludos,<br><strong>Equipo ecoWallet</strong></p>
              </div>
              
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>&copy; 2025 ecoWallet. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Hola ${nombre},

          Has iniciado un proceso de pago en ecoWallet.

          Tu código de confirmación es: ${token}

          Monto a pagar: $${monto.toLocaleString()}

          Este código expira en 10 minutos.
          No compartas este código con nadie.

          Saludos,
          Equipo ecoWallet
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, nombre: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"ecoWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎉 Bienvenido a ecoWallet',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 32px;
              }
              .content {
                padding: 40px 30px;
              }
              .welcome-icon {
                text-align: center;
                font-size: 64px;
                margin: 20px 0;
              }
              .feature {
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💳 ecoWallet</h1>
              </div>
              
              <div class="content">
                <div class="welcome-icon">🎉</div>
                <h2 style="text-align: center; color: #667eea;">¡Bienvenido, ${nombre}!</h2>
                
                <p>Nos alegra que formes parte de ecoWallet. Tu cuenta ha sido creada exitosamente.</p>
                
                <div class="feature">
                  <strong>💰 Recarga tu billetera</strong>
                  <p>Añade saldo de forma fácil y segura.</p>
                </div>
                
                <div class="feature">
                  <strong>🛒 Realiza pagos</strong>
                  <p>Paga con confirmación de seguridad mediante token.</p>
                </div>
                
                <div class="feature">
                  <strong>📊 Consulta tu saldo</strong>
                  <p>Mantén el control de tus finanzas en todo momento.</p>
                </div>
                
                <p style="margin-top: 30px;">¡Comienza a usar tu billetera ahora!</p>
                
                <p>Saludos,<br><strong>Equipo ecoWallet</strong></p>
              </div>
              
              <div class="footer">
                <p>&copy; 2025 ecoWallet. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenida enviado a:', email);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de bienvenida:', error);
      return false;
    }
  }

  async sendRechargeConfirmation(
    email: string,
    nombre: string,
    monto: number,
    nuevoSaldo: number,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"ecoWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '✅ Recarga exitosa - ecoWallet',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
              }
              .success-icon {
                text-align: center;
                font-size: 64px;
                margin: 20px 0;
              }
              .transaction-box {
                background-color: #f0fdf4;
                border: 2px solid #10b981;
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
              }
              .transaction-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #d1fae5;
              }
              .transaction-row:last-child {
                border-bottom: none;
              }
              .label {
                color: #666;
                font-weight: 500;
              }
              .value {
                font-weight: bold;
                color: #059669;
              }
              .amount {
                font-size: 32px;
                color: #10b981;
              }
              .balance-box {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
              }
              .balance-label {
                font-size: 14px;
                opacity: 0.9;
              }
              .balance-amount {
                font-size: 36px;
                font-weight: bold;
                margin: 10px 0;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
              .date {
                color: #999;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💳 ecoWallet</h1>
              </div>
              
              <div class="content">
                <div class="success-icon">✅</div>
                <h2 style="text-align: center; color: #10b981;">¡Recarga Exitosa!</h2>
                
                <p>Hola <strong>${nombre}</strong>,</p>
                
                <p>Tu recarga se ha procesado correctamente. Aquí están los detalles:</p>
                
                <div class="transaction-box">
                  <div class="transaction-row">
                    <span class="label">Tipo de transacción:</span>
                    <span class="value">Recarga de saldo</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Monto recargado:</span>
                    <span class="value amount">$${monto.toLocaleString()}</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Fecha y hora:</span>
                    <span class="value">${new Date().toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Estado:</span>
                    <span class="value">✅ Completada</span>
                  </div>
                </div>
                
                <div class="balance-box">
                  <div class="balance-label">Tu nuevo saldo disponible es:</div>
                  <div class="balance-amount">$${nuevoSaldo.toLocaleString()}</div>
                </div>
                
                <p style="text-align: center; color: #666; margin-top: 30px;">
                  Ya puedes usar tu saldo para realizar pagos en ecoWallet.
                </p>
                
                <p style="margin-top: 30px;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                
                <p>Saludos,<br><strong>Equipo ecoWallet</strong></p>
              </div>
              
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>&copy; 2025 ecoWallet. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          ¡Recarga Exitosa!

          Hola ${nombre},

          Tu recarga se ha procesado correctamente.

          Monto recargado: $${monto.toLocaleString()}
          Nuevo saldo: $${nuevoSaldo.toLocaleString()}
          Fecha: ${new Date().toLocaleString('es-ES')}
          Estado: Completada

          Saludos,
          Equipo ecoWallet
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de recarga enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de recarga:', error);
      return false;
    }
  }

  async sendPaymentConfirmation(
    email: string,
    nombre: string,
    monto: number,
    nuevoSaldo: number,
    success: boolean,
  ): Promise<boolean> {
    try {
      const isSuccess = success;
      const statusColor = isSuccess ? '#10b981' : '#ef4444';
      const statusGradient = isSuccess
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      const statusIcon = isSuccess ? '✅' : '❌';
      const statusText = isSuccess ? 'Pago Exitoso' : 'Pago Fallido';
      const statusBg = isSuccess ? '#f0fdf4' : '#fef2f2';
      const statusBorder = isSuccess ? '#10b981' : '#ef4444';

      const mailOptions = {
        from: `"ecoWallet" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${statusIcon} ${statusText} - ecoWallet`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: ${statusGradient};
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
              }
              .status-icon {
                text-align: center;
                font-size: 64px;
                margin: 20px 0;
              }
              .transaction-box {
                background-color: ${statusBg};
                border: 2px solid ${statusBorder};
                border-radius: 10px;
                padding: 25px;
                margin: 25px 0;
              }
              .transaction-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid ${isSuccess ? '#d1fae5' : '#fecaca'};
              }
              .transaction-row:last-child {
                border-bottom: none;
              }
              .label {
                color: #666;
                font-weight: 500;
              }
              .value {
                font-weight: bold;
                color: ${statusColor};
              }
              .amount {
                font-size: 32px;
                color: ${statusColor};
              }
              .balance-box {
                background: ${statusGradient};
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
              }
              .balance-label {
                font-size: 14px;
                opacity: 0.9;
              }
              .balance-amount {
                font-size: 36px;
                font-weight: bold;
                margin: 10px 0;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
              .info-box {
                background-color: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💳 ecoWallet</h1>
              </div>
              
              <div class="content">
                <div class="status-icon">${statusIcon}</div>
                <h2 style="text-align: center; color: ${statusColor};">${statusText}</h2>
                
                <p>Hola <strong>${nombre}</strong>,</p>
                
                ${
                  isSuccess
                    ? '<p>Tu pago se ha procesado correctamente. Aquí están los detalles:</p>'
                    : '<p>Hubo un problema al procesar tu pago. Los detalles son los siguientes:</p>'
                }
                
                <div class="transaction-box">
                  <div class="transaction-row">
                    <span class="label">Tipo de transacción:</span>
                    <span class="value">Pago</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Monto:</span>
                    <span class="value amount">$${monto.toLocaleString()}</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Fecha y hora:</span>
                    <span class="value">${new Date().toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                  <div class="transaction-row">
                    <span class="label">Estado:</span>
                    <span class="value">${statusIcon} ${isSuccess ? 'Completado' : 'Fallido'}</span>
                  </div>
                </div>
                
                ${
                  isSuccess
                    ? `
                  <div class="balance-box">
                    <div class="balance-label">Tu nuevo saldo disponible es:</div>
                    <div class="balance-amount">$${nuevoSaldo.toLocaleString()}</div>
                  </div>
                  
                  <p style="text-align: center; color: #666; margin-top: 30px;">
                    Gracias por usar ecoWallet para tus transacciones.
                  </p>
                `
                    : `
                  <div class="info-box">
                    <strong>¿Qué pasó?</strong>
                    <p style="margin: 10px 0 0 0;">
                      El pago no pudo completarse. Esto puede deberse a:
                    </p>
                    <ul style="margin: 10px 0;">
                      <li>Token de confirmación incorrecto</li>
                      <li>Token expirado (más de 10 minutos)</li>
                      <li>Sesión de pago inválida</li>
                    </ul>
                    <p style="margin: 10px 0 0 0;">
                      Tu saldo no ha sido afectado. Puedes intentar realizar el pago nuevamente.
                    </p>
                  </div>
                `
                }
                
                <p style="margin-top: 30px;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                
                <p>Saludos,<br><strong>Equipo ecoWallet</strong></p>
              </div>
              
              <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>&copy; 2025 ecoWallet. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          ${statusText}

          Hola ${nombre},

          ${
            isSuccess
              ? 'Tu pago se ha procesado correctamente.'
              : 'Hubo un problema al procesar tu pago.'
          }

          Monto: $${monto.toLocaleString()}
          ${isSuccess ? `Nuevo saldo: $${nuevoSaldo.toLocaleString()}` : 'Tu saldo no ha sido afectado.'}
          Fecha: ${new Date().toLocaleString('es-ES')}
          Estado: ${isSuccess ? 'Completado' : 'Fallido'}

          ${
            !isSuccess
              ? `
          ¿Qué pasó?
          - Token de confirmación incorrecto
          - Token expirado (más de 10 minutos)
          - Sesión de pago inválida
          
          Puedes intentar realizar el pago nuevamente.
          `
              : ''
          }

          Saludos,
          Equipo ecoWallet
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Email de pago ${isSuccess ? 'exitoso' : 'fallido'} enviado:`,
        info.messageId,
      );
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de pago:', error);
      return false;
    }
  }

  // Método para verificar la configuración
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor de email listo');
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con el servidor de email:', error);
      return false;
    }
  }
}
