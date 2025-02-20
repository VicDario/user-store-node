import path from 'path';
import fs from 'fs';
import type { UploadedFile } from 'express-fileupload';
import { UUIDAdapter } from '../../config';
import { CustomError } from '../../domain';

export class FileUploadService {
  constructor(private readonly uuid = UUIDAdapter) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  }

  public async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif']
  ) {
    const fileExtension = file.mimetype.split('/').at(1) ?? '';
    if (!validExtensions.includes(fileExtension))
      throw CustomError.badRequest('Invalid file extension');

    const destination = path.join(__dirname, `../../../public/`, folder);
    this.checkFolder(destination);
    const fileName = `${this.uuid.generate()}.${fileExtension}`;
    await file.mv(`${destination}/${fileName}`);
    return { fileName };
  }

  public async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif']
  ) {
    const fileNames = await Promise.all(files.map((file) => this.uploadSingle(file, folder, validExtensions)));
    return fileNames;
  }
}
