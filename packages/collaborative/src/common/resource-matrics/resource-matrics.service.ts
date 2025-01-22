import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class ResourceMetricsService {
  async getCpuUsage(): Promise<number> {
    const cpus = os.cpus();

    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const usage = ((totalTick - totalIdle) / totalTick) * 100;
    return parseFloat(usage.toFixed(2));
  }

  async getMemoryUsage(): Promise<number> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usage = (usedMemory / totalMemory) * 100;
    return parseFloat(usage.toFixed(2));
  }

  async getSystemMetrics(): Promise<{
    cpuUsage: number;
    memoryUsage: number;
    uptime: number;
  }> {
    const [cpuUsage, memoryUsage, uptime] = await Promise.all([
      this.getCpuUsage(),
      this.getMemoryUsage(),
      os.uptime(),
    ]);

    return {
      cpuUsage,
      memoryUsage,
      uptime,
    };
  }
}
