import { Injectable } from '@nestjs/common';
import { Camera } from '../camera/camera.entity';
import { HistoryCamera } from '../history_camera/history_camera.entity';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as moment from 'moment';
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
        fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function () {
                console.log("Write to CSV successfully!");
            })
            .pipe(ws);
        return fileName;
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

        const postfix = moment(new Date()).format('DD-MM-YYYY');
        const fileName = `historyCameraData_${postfix}.csv`;
        const ws = fs.createWriteStream("exportCSVFile/history/" + fileName);
        fastcsv
            .write(result, { headers: true })
            .on("finish", function () {
                console.log("Write to CSV successfully!");
            })
            .pipe(ws);
        return fileName;
    }

}