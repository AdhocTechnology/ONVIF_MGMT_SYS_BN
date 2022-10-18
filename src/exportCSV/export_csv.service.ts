import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Camera } from '../camera/camera.entity';
import { HistoryCamera } from '../history_camera/history_camera.entity';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as moment from 'moment';
import { join } from 'path';
@Injectable()
export class ExportCsvService {
    constructor(
    ) { }
    async createCurrentCSV(cameraData: Camera[]): Promise<string> {
        const postfix = moment(new Date()).format('DD-MM-YYYY');
        const fileName = `allCameraData_${postfix}.csv`;
        const ws = fs.createWriteStream("exportCSVFile/current/" + fileName);
        const jsonData = cameraData.map(camera => {
            return {
                ipCamera: camera.ipCamera,
                username: camera.username,
                password: camera.password,
                warrantyExp: camera.warrantyExp,
                model: camera.model,
                manufacturer: camera.manufacturer,
                serialNumber: camera.serialNumber,
                hardwareId: camera.hardwareId,
                firmwareVersion: camera.firmwareVersion,
                port: camera.port,
                status: camera.status,
                responseTime: moment(camera.responseTime, 'YYYY-MM-DD HH:mm:ss'),
                createAt: moment(camera.createAt, 'YYYY-MM-DD HH:mm:ss'),
            }
        });

        if (!fs.existsSync('/exportCSVFile/current') || !fs.existsSync('/exportCSVFile/history')) {
            if (!fs.existsSync('/exportCSVFile')) {
                fs.mkdirSync("/exportCSVFile");
            }
            if (!fs.existsSync('/exportCSVFile/current')) {
                fs.mkdirSync("/exportCSVFile/current");
            }
            if (!fs.existsSync('/exportCSVFile/history')) {
                fs.mkdirSync("/exportCSVFile/history");
            }
        }

        const writeCSV = await this.writeCSV(jsonData, ws);

        if (writeCSV) {
            return fileName;
        }
        throw new InternalServerErrorException("Cannot create CSV file.");


    }

    async writeCSV(data, ws) {
        return new Promise((resolve, reject) => {
            let status = false;
            fastcsv
                .write(data, { headers: true })
                .on("error", reject)
                .on("finish", function () {
                    console.log('Write to CSV successfully!');
                    status = true;
                    resolve(status);
                })
                .pipe(ws);
        });
    }


    async createHistoryCSV(historyCameraData: HistoryCamera[]): Promise<string> {
        const historyCamerasCSV = historyCameraData.map(camera => {
            return {
                ipCamera: camera.ipCamera,
                username: camera.username,
                password: camera.password,
                warrantyExp: camera.warrantyExp,
                model: camera.model,
                manufacturer: camera.manufacturer,
                serialNumber: camera.serialNumber,
                hardwareId: camera.hardwareId,
                firmwareVersion: camera.firmwareVersion,
                port: camera.port,
                status: camera.status,
                responseTime: moment(camera.responseTime).format('YYYY-MM-DD HH:mm:ss'),
                createAt: moment(camera.createAt).format('YYYY-MM-DD HH:mm:ss'),
            }
        });

        let createAt = historyCamerasCSV[0].createAt;

        const result = [];
        historyCamerasCSV.forEach((camera) => {
            if (createAt !== camera.createAt) {
                result.push([]);
                createAt = camera.createAt;
            }
            result.push(camera);
        });

        if (!fs.existsSync('/exportCSVFile/current') || !fs.existsSync('/exportCSVFile/history')) {
            if (!fs.existsSync('/exportCSVFile')) {
                fs.mkdirSync("/exportCSVFile");
            }
            if (!fs.existsSync('/exportCSVFile/current')) {
                fs.mkdirSync("/exportCSVFile/current");
            }
            if (!fs.existsSync('/exportCSVFile/history')) {
                fs.mkdirSync("/exportCSVFile/history");
            }
        }

        const postfix = moment(new Date()).format('DD-MM-YYYY');
        const fileName = `historyCameraData_${postfix}.csv`;
        const ws = fs.createWriteStream("exportCSVFile/history/" + fileName);

        const writeCSV = await this.writeCSV(result, ws);

        if (writeCSV) {
            return fileName;
        }
        throw new InternalServerErrorException("Cannot create CSV file.");

        // const postfix = moment(new Date()).format('DD-MM-YYYY');
        // const fileName = `historyCameraData_${postfix}.csv`;
        // const ws = fs.createWriteStream("exportCSVFile/history/" + fileName);
        // fastcsv
        //     .write(result, { headers: true })
        //     .on("finish", function () {
        //         console.log("Write to CSV successfully!");
        //     })
        //     .pipe(ws);
        // return fileName;
    }

}