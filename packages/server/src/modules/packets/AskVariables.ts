import GameUser from "../../containers/GameUser.js";
import GP from "../../libs/GP.js";
import { SocketMessage } from "../../libs/network/Binary.js";
import { Transport } from "../../libs/Transport.js";
import { DBMaps, DBServers } from "../../services/definitions.js";
import { PacketParams } from "../../types/network.js";
import { PacketBase } from "../PacketBase.js";

export default class AskVariables implements PacketBase {
  type = 1;
  subType = 6;

  async handle(user: GameUser, _params: PacketParams): Promise<boolean> {
    // ask variables
    const transportList = [new Transport(1)];

    const sm = new SocketMessage(1, 4);
    transportList.forEach((transport) => {
      sm.bitWriteBoolean(true);
      sm.bitWriteUnsignedInt(GP.BIT_TRANSPORT_ID, transport.id);

      if (transport.maps.length) {
        // on écrit les maps
        sm.bitWriteBoolean(true);
        sm.bitWriteUnsignedInt(4, 0);
        transport.maps.map((map) => {
          sm.bitWriteBoolean(true);
          sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, map);
        });
        sm.bitWriteBoolean(false);
      }

      if (transport.values.length) {
        sm.bitWriteBoolean(true);
        sm.bitWriteUnsignedInt(4, 1);
        transport.values.forEach((value) => {
          sm.bitWriteBoolean(true);
          sm.bitWriteUnsignedInt(10, value.time);
          sm.bitWriteUnsignedInt(5, value.value);
        });
        sm.bitWriteBoolean(false);
      }
      sm.bitWriteBoolean(false);
    });
    sm.bitWriteBoolean(false);

    DBMaps.forEach((map) => {
      sm.bitWriteBoolean(true);
      sm.bitWriteUnsignedInt(GP.BIT_MAP_ID, map.id);
      sm.bitWriteUnsignedInt(GP.BIT_MAP_FILEID, map.fileId);
      sm.bitWriteString(map.nom);
      sm.bitWriteUnsignedInt(GP.BIT_TRANSPORT_ID, map.transportId);
      sm.bitWriteSignedInt(17, map.mapXpos);
      sm.bitWriteSignedInt(17, map.mapYpos);
      sm.bitWriteUnsignedInt(5, map.meteoId);
      sm.bitWriteUnsignedInt(2, map.peace);
      sm.bitWriteUnsignedInt(GP.BIT_MAP_REGIONID, map.regionId);
      sm.bitWriteUnsignedInt(GP.BIT_MAP_PLANETID, map.planetId);
    });

    sm.bitWriteBoolean(false);

    DBServers.forEach((server) => {
      // écriture des serveurs
      sm.bitWriteBoolean(true);
      sm.bitWriteString(server.nom);
      sm.bitWriteUnsignedInt(16, server.port);
    });
    sm.bitWriteBoolean(false);

    sm.bitWriteUnsignedInt(GP.BIT_SERVER_ID, user.serverId);
    sm.bitWriteUnsignedInt(8, 1);
    user.send(sm);

    return true;
  }
}
