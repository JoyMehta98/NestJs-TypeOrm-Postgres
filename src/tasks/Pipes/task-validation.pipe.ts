import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';
import { Task } from '../task.entity';

export class TaskValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];

  private isStatusValid(status: TaskStatus) {
    return this.allowedStatus.includes(status);
  }
  transform(value: Task) {
    console.log(value, 'value');
    value.status = !value.status ? TaskStatus.OPEN : value.status;
    if (!this.isStatusValid(value.status)) {
      throw new BadRequestException('Status is not valid');
    }
    return value;
  }
}
