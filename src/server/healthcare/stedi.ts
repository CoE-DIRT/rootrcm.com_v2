/**
 * Stedi is the planned primary clearinghouse. This adapter stays typed and disabled.
 * No vendor keys, sandbox calls or live 270/271 / 276/277 traffic.
 */
import { disabledAdapter } from '../../integrations/disabled.ts';
import {
  describeStediConnection as describeStedi,
  type StediConnection,
  type StediConnectionRequest,
} from '../../integrations/stedi/client.ts';

export function connectStedi(input: StediConnectionRequest) {
  void input;
  return disabledAdapter('stedi');
}

export function describeStediConnection(input?: StediConnectionRequest): StediConnection {
  return describeStedi(input);
}

export function createStediClient() {
  return {
    connect: connectStedi,
    describe: describeStediConnection,
  };
}
