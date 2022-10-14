import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChangedCameraDto } from '../dto/create-changed_camera.dto';
import { ChangedCamera } from './changedCamera.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChangedCameraService {
    constructor(
        @InjectRepository(ChangedCamera)
        private readonly changedCemeraRepository: Repository<ChangedCamera>
    ) { }

    async createChangedCamera(createChangedCameraDto: CreateChangedCameraDto): Promise<ChangedCamera> {
        const newChangedCamera = new ChangedCamera();
        newChangedCamera.ipCamera = createChangedCameraDto.ipCamera;
        newChangedCamera.oldModel = createChangedCameraDto.oldModel;
        newChangedCamera.oldManufacturer = createChangedCameraDto.oldManufacturer;
        newChangedCamera.oldSerialNumber = createChangedCameraDto.oldSerialNumber;
        newChangedCamera.oldHardwareId = createChangedCameraDto.oldHardwareId;
        newChangedCamera.oldFirmwareVersion = createChangedCameraDto.oldFirmwareVersion;
        newChangedCamera.oldPort = createChangedCameraDto.oldPort;

        newChangedCamera.newModel = createChangedCameraDto.newModel;
        newChangedCamera.newManufacturer = createChangedCameraDto.newManufacturer;
        newChangedCamera.newSerialNumber = createChangedCameraDto.newSerialNumber;
        newChangedCamera.newHardwareId = createChangedCameraDto.newHardwareId;
        newChangedCamera.newFirmwareVersion = createChangedCameraDto.newFirmwareVersion;
        newChangedCamera.newPort = createChangedCameraDto.newPort;
        newChangedCamera.createAt = new Date().toISOString();
        return this.changedCemeraRepository.save(newChangedCamera);
    }
}