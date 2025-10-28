import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface SaleEmailData {
  type: 'recharge' | 'service' | 'pin';
  userName: string;
  productName: string;
  amount: number;
  reference: string;
  date: Date;
  status: 'accepted' | 'rejected';
  // Campos opcionales según el tipo
  bonus?: number;
  charge?: number;
  phone?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private notifyEmail: string;

  constructor(private configService: ConfigService) {
    // Usar EMAIL_FROM como destinatario de notificaciones
    this.notifyEmail = this.configService.get<string>('EMAIL_FROM')!;
    
    const emailProvider = this.configService.get<string>('EMAIL_PROVIDER');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_APP_PASSWORD');

    // Determinar configuración SMTP según el proveedor
    let smtpHost: string;
    let smtpPort: number;
    
    switch (emailProvider?.toLowerCase()) {
      case 'gmail':
        smtpHost = 'smtp.gmail.com';
        smtpPort = 587;
        break;
      case 'outlook':
      case 'hotmail':
        smtpHost = 'smtp-mail.outlook.com';
        smtpPort = 587;
        break;
      case 'yahoo':
        smtpHost = 'smtp.mail.yahoo.com';
        smtpPort = 587;
        break;
      default:
        smtpHost = 'smtp.gmail.com'; // default
        smtpPort = 587;
    }

    // Validar que existan las variables
    if (!emailUser || !emailPass) {
      console.error('⚠️ Variables de email no configuradas correctamente');
      console.error(`EMAIL_USER: ${emailUser || 'NO DEFINIDO'}`);
      console.error(`EMAIL_APP_PASSWORD: ${emailPass ? '***' : 'NO DEFINIDO'}`);
      console.error(`EMAIL_PROVIDER: ${emailProvider || 'NO DEFINIDO'}`);
      
      // Crear transportador fake que solo logea
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
      });
      return;
    }
    
    console.log(`📧 Configurando email con ${emailProvider} (${smtpHost}:${smtpPort})`);
    
    // Configurar el transportador de nodemailer
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // true para 465, false para 587
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      // Configuración adicional para debugging
      debug: process.env.NODE_ENV !== 'production',
      logger: process.env.NODE_ENV !== 'production',
    });
    
    // Verificar conexión al iniciar
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor SMTP conectado correctamente');
    } catch (error) {
      console.error('❌ Error al conectar con servidor SMTP:', error.message);
    }
  }

  async sendSaleNotification(saleData: SaleEmailData): Promise<void> {
    try {
      const subject = this.getEmailSubject(saleData);
      const html = this.buildEmailTemplate(saleData);

      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_USER'),
        to: this.notifyEmail,
        subject,
        html,
      });

      console.log(`✅ Email de notificación enviado: ${saleData.type} - ${saleData.status}`);
    } catch (error) {
      console.error('❌ Error al enviar email de notificación:', error);
      // No lanzamos el error para que no afecte la venta
    }
  }

  private getEmailSubject(saleData: SaleEmailData): string {
    const statusEmoji = saleData.status === 'accepted' ? '✅' : '❌';
    const typeText = {
      recharge: 'Recarga',
      service: 'Pago de Servicio',
      pin: 'Venta de PIN'
    }[saleData.type];

    return `${statusEmoji} ${typeText} ${saleData.status === 'accepted' ? 'Exitosa' : 'Fallida'} - $${saleData.amount}`;
  }

  private buildEmailTemplate(saleData: SaleEmailData): string {
    const statusColor = saleData.status === 'accepted' ? '#10b981' : '#ef4444';
    const statusText = saleData.status === 'accepted' ? 'EXITOSA' : 'FALLIDA';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: ${statusColor};
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-radius: 0 0 8px 8px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-label {
              font-weight: bold;
              color: #6b7280;
            }
            .info-value {
              color: #111827;
            }
            .amount {
              font-size: 24px;
              font-weight: bold;
              color: ${statusColor};
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${statusText}: ${this.getTypeLabel(saleData.type)}</h1>
          </div>
          <div class="content">
            <div class="amount">$${saleData.amount.toFixed(2)}</div>
            
            <div class="info-row">
              <span class="info-label">Usuario:</span>
              <span class="info-value">${saleData.userName}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Producto/Servicio:</span>
              <span class="info-value">${saleData.productName}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Referencia:</span>
              <span class="info-value">${saleData.reference}</span>
            </div>
            
            ${saleData.phone ? `
            <div class="info-row">
              <span class="info-label">Teléfono:</span>
              <span class="info-value">${saleData.phone}</span>
            </div>
            ` : ''}
            
            ${saleData.bonus !== undefined ? `
            <div class="info-row">
              <span class="info-label">Bono:</span>
              <span class="info-value" style="color: #10b981; font-weight: bold;">+$${saleData.bonus.toFixed(2)}</span>
            </div>
            ` : ''}
            
            ${saleData.charge !== undefined ? `
            <div class="info-row">
              <span class="info-label">Cargo:</span>
              <span class="info-value" style="color: #ef4444; font-weight: bold;">$${saleData.charge.toFixed(2)}</span>
            </div>
            ` : ''}
            
            <div class="info-row">
              <span class="info-label">Fecha:</span>
              <span class="info-value">${this.formatDate(saleData.date)}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Estado:</span>
              <span class="info-value" style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Notificación automática del sistema de ventas</p>
            <p>${new Date().toLocaleString('es-MX', { timeZone: 'America/Merida' })}</p>
          </div>
        </body>
      </html>
    `;
  }

  private getTypeLabel(type: string): string {
    const labels = {
      recharge: 'Recarga Telefónica',
      service: 'Pago de Servicio',
      pin: 'Venta de PIN'
    };
    return labels[type] || type;
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-MX', {
      timeZone: 'America/Merida',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}