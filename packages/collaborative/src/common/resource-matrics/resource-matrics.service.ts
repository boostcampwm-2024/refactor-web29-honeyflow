import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class ResourceMetricsService {
  async getCpuUsage(): Promise<{ total: number; usage: number }> {
    const cpus = os.cpus();

    let user = 0;
    let nice = 0;
    let sys = 0;
    let idle = 0;
    let irq = 0;

    for (const cpu of cpus) {
      const times = cpu.times;
      user += times.user;
      nice += times.nice;
      sys += times.sys;
      idle += times.idle;
      irq += times.irq;
    }

    const total = user + nice + sys + idle + irq;
    const usage = ((total - idle) / total) * 100;

    return { total, usage: parseFloat(usage.toFixed(2)) };
  }

  async getMemoryUsage(): Promise<{
    total: number;
    free: number;
    used: number;
    usage: number;
  }> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const usage = (usedMemory / totalMemory) * 100;

    return {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usage: parseFloat(usage.toFixed(2)),
    };
  }

  async getUptime(): Promise<number> {
    return os.uptime();
  }

  async getSystemMetrics(): Promise<{
    cpu: { total: number; usage: number };
    memory: { total: number; free: number; used: number; usage: number };
    uptime: number;
  }> {
    const [cpu, memory, uptime] = await Promise.all([
      this.getCpuUsage(),
      this.getMemoryUsage(),
      this.getUptime(),
    ]);

    return {
      cpu,
      memory,
      uptime,
    };
  }
}
