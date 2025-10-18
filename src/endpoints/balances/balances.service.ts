import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsultaSIVETEL } from './dto/consulta-sivetel';

@Injectable()
export class BalancesService {

    endpoint : string = ''

    constructor(
        private configService: ConfigService
    ) {
        this.endpoint = this.configService.get<string>('PROVIDER_APIURL')!;
        this.endpoint = `${this.endpoint}`
    }

    async getBalance(): Promise<any> {
        try {
            const endpoint = `${this.endpoint}/consultarSaldos`;
            const cuenta = this.configService.get<string>('SIVETEL_NUMBER');
            const usuario = this.configService.get<string>('SIVETEL_USUARIO');
            const password = this.configService.get<string>('SIVETEL_PASSWORD');

            // Validar que las credenciales existan
            if (!cuenta || !usuario || !password) {
                throw new HttpException(
                    'Credenciales de SIVETEL no configuradas correctamente',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            // Crear el body en formato x-www-form-urlencoded
            const params = new URLSearchParams();
            params.append('cuenta', cuenta);
            params.append('usuario', usuario);
            params.append('password', password);

            // Realizar la petición con fetch
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });
            // Validar que la respuesta sea exitosa
            if (!response.ok) {
                throw new HttpException(
                    `Error en la petición: ${response.status} ${response.statusText}`,
                    HttpStatus.BAD_GATEWAY
                );
            }

            // Parsear la respuesta JSON
            const data: ConsultaSIVETEL = await response.json();

            // Validar la respuesta de SIVETEL
            if (!data.status) {
                throw new HttpException(
                    data.message || 'Error al consultar SIVETEL',
                    HttpStatus.BAD_REQUEST
                );
            }
            const { tiempoaire, sms, pagoservicios } = data.data;
            const balance = {
                rechargeBalance : tiempoaire,
                sms,
                servicesBalance: pagoservicios
            }
            return balance;

        } catch (error) {
            console.log(error);
            // Re-lanzar excepciones HTTP de NestJS
            if (error instanceof HttpException) {
                throw error;
            }

            // Manejo de errores de red o fetch
            if (error instanceof TypeError) {
                throw new HttpException(
                    `Error de conexión con SIVETEL: ${error.message}`,
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            }

            // Error genérico
            throw new HttpException(
                `Error inesperado al consultar el balance: ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
