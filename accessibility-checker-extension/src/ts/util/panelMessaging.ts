/******************************************************************************
     Copyright:: 2020- IBM, Inc

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
  *****************************************************************************/
 
import CommonMessaging from "./commonMessaging";

export default class PanelMessaging {

    public static addListener(type: string, listener: (message: any) => Promise<any>) {
        CommonMessaging.addListener(type, listener);
    }

    public static async sendToBackground(type: string, message: any): Promise<any> {
        let wakeResp: any = {
            ok: false
        };
        // while (!wakeResp.ok) {
            try {
                wakeResp = await this._sendToBackground("IBMA_AC_WAKEUP", {});
            } catch (err) {
                wakeResp = err;
            }
            if (!wakeResp.ok) {
                console.error(wakeResp);
            }
        // }
        return this._sendToBackground(type, message);
    }

    private static _sendToBackground(type: string, message: any): Promise<any> {
        let myMessage = JSON.parse(JSON.stringify(message));
        myMessage.type = type;
        return new Promise((resolve, reject) => {
			chrome.runtime.sendMessage(myMessage, function (res) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else {
                    if (res) {
                        if (typeof res === "string") {
                            try {
                                res = JSON.parse(res);
                            } catch (e) {}
                        }
                        resolve(res);
                    } else {
                        resolve(null);
                    }
                }
            });
        })
    }

}
