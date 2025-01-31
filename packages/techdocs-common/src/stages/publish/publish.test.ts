/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Publisher } from './publish';
import { LocalPublish } from './local';
import { GoogleGCSPublish } from './googleStorage';
import { AwsS3Publish } from './awsS3';

const logger = getVoidLogger();
const discovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest.fn().mockResolvedValueOnce('http://localhost:7000'),
  getExternalBaseUrl: jest.fn(),
};

describe('Publisher', () => {
  it('should create local publisher by default', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
      },
    });

    const publisher = await Publisher.fromConfig(mockConfig, {
      logger,
      discovery,
    });
    expect(publisher).toBeInstanceOf(LocalPublish);
  });

  it('should create local publisher from config', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'local',
        },
      },
    });

    const publisher = await Publisher.fromConfig(mockConfig, {
      logger,
      discovery,
    });
    expect(publisher).toBeInstanceOf(LocalPublish);
  });

  it('should create google gcs publisher from config', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'googleGcs',
          googleGcs: {
            credentials: '{}',
            projectId: 'gcp-project-id',
            bucketName: 'bucketName',
          },
        },
      },
    });

    const publisher = await Publisher.fromConfig(mockConfig, {
      logger,
      discovery,
    });
    expect(publisher).toBeInstanceOf(GoogleGCSPublish);
  });

  it('should create AWS S3 publisher from config', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'awsS3',
          awsS3: {
            credentials: {
              accessKeyId: 'accessKeyId',
              secretAccessKey: 'secretAccessKey',
            },
            bucketName: 'bucketName',
          },
        },
      },
    });

    const publisher = await Publisher.fromConfig(mockConfig, {
      logger,
      discovery,
    });
    expect(publisher).toBeInstanceOf(AwsS3Publish);
  });
});
