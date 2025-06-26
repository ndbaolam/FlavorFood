import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmbeddingService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generate(content: any): Promise<number[]> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.configService.get<string>('FASTAPI_HOST')}/embed`,
        {
          content,
        },
      ),
    );
    return response.data.embedding;
  }

  average(vectors: number[][]): number[] {
    const len = vectors.length;
    const dim = vectors[0].length;
    const sum = Array(dim).fill(0);

    vectors.forEach((vec) => {
      for (let i = 0; i < dim; i++) {
        sum[i] += vec[i];
      }
    });

    return sum.map((x) => x / len);
  }

  normalize(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return norm === 0 ? vector : vector.map((x) => x / norm);
  }
}
