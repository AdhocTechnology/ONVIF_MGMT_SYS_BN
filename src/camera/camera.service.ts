import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { UpdateCameraDto } from '../dto/update-camera.dto';
import { Camera } from './camera.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
export const NUMBER_OF_LOOP_CHECKING: number = 3;

@Injectable()
export class CameraService {
    constructor(
        @InjectRepository(Camera)
        private readonly cemeraRepository: Repository<Camera>
    ) { }

    async createCamera(createCameraDto: CreateCameraDto): Promise<Camera> {
        const existingCamera = await this.cemeraRepository.findOneBy({ ipCamera: createCameraDto.ipCamera });
        if (existingCamera) {
            throw new ConflictException(`camera is already exist`);
        }
        const newCamera = new Camera();
        newCamera.ipCamera = createCameraDto.ipCamera;
        newCamera.username = createCameraDto.username;
        newCamera.password = createCameraDto.password;
        newCamera.warrantyExp = createCameraDto.warrantyExp;
        newCamera.status = false;
        newCamera.model = '-';
        newCamera.createAt = new Date().toISOString();
        return this.cemeraRepository.save(newCamera);
    }

    async updateCamera(cameraId: number, updateCameraDto: UpdateCameraDto): Promise<Camera> {
        const existingCamera = await this.cemeraRepository.findOne({ where :{id: cameraId} });
        if (!existingCamera) {
            throw new NotFoundException(`camera #${cameraId} not found`);
        }
        await this.cemeraRepository.update({ id: cameraId }, updateCameraDto);
        return await this.cemeraRepository.findOneBy({ id: cameraId });
    }

    async findOneAndUpdate(where: object, updateCameraDto: UpdateCameraDto): Promise<Camera> {
        const existingCamera = await this.cemeraRepository.findOneBy(where);
        if (!existingCamera) {
            throw new NotFoundException(`camera not found`);
        }
        await this.cemeraRepository.update(where, updateCameraDto);
        return await this.cemeraRepository.findOneBy(where);
    }



    async clearStatus(): Promise<void> {
        await this.cemeraRepository.update({}, { status: false });
    }

    async getAllCamera(filter?: object): Promise<Camera[]> {
        const cameraData = await this.cemeraRepository.find(filter);
        return cameraData;
    }

    async getUsernamePasswordCamera(): Promise<Camera[]> {
        const cameraData = await this.cemeraRepository.createQueryBuilder('c').select(['c.ipCamera', 'c.username', 'c.password']).getMany();
        return cameraData;
    }

    async getCamera(cameraId: number): Promise<Camera> {
        const existingCamera = await this.cemeraRepository.findOneBy({ id: cameraId });
        if (!existingCamera) {
            throw new NotFoundException(`Camera #${cameraId} not found`);
        }
        return existingCamera;
    }

    async getCameraWithIP(ipCamera: string): Promise<Camera> {
        const existingCamera = await this.cemeraRepository.findOneBy({ ipCamera: ipCamera });
        if (!existingCamera) {
            throw new NotFoundException(`Camera ip : ${ipCamera} not found`);
        }
        return existingCamera;
    }

    async deleteCamera(cameraId: number): Promise<void> {
        const deletedCamera = await this.cemeraRepository.findOneBy({ id: cameraId });
        if (!deletedCamera) {
            throw new NotFoundException(`Camera #${cameraId} not found`);
        }
        await this.cemeraRepository.delete(cameraId);
    }


}