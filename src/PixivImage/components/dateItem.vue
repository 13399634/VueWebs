<template v-if="date !== null">
  <div class="item" v-bind:key="date">
    <date-img
      v-for="page in Item"
      v-bind:key="page.work.id"
      v-bind:pic="page"
    ></date-img>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
} from "vue";

const superagent = require("superagent");
import { UrlParam } from "@/../Js/tools-getParam";
import { sleep } from "@/../Js/tools-sleep";
import { dev, RePixivOrigin, RePximgOriginP } from "@/../Js/PixivImage/urlRe";
import { getLocalId, getLocalUid } from "@/../Js/PixivImage/LocalDataRead";
import { getIdAll, getUidAll } from "@/../Js/PixivImage/IdDataRead";
// 图片块
import dateImg from "@/PixivImage/components/dateImg.vue";

// ranking.php 获取数据字典类型
interface ranking_ud {
  // ItemTypeP1.work.id
  illust_id: number;
  // ItemTypeP1.work.page
  illust_page_count: string;
  // ItemTypeP1.work.img
  url: string;
  // ItemTypeP1.work.rank
  rank: number;
  // 昨天
  yes_rank: number;
  // ItemTypeP1.work.title
  title: string;
  // ItemTypeP1.user.uid
  user_id: number;
  // ItemTypeP1.user.author
  user_name: string;
}

// ranking.php 单个图片块加载字典数据
// 过程1
// 未加载 haveRead
interface ItemTypeP1 {
  // 作品
  work: {
    // 请求ID
    id: number;
    // 图片数量
    page: string;
    // 图片链接
    img: string;
    // 排名
    rank: number;
    // 标题
    title: string;
  };
  // 作者
  user: {
    // 请求UID
    uid: number;
    // 名字
    author: string;
  };
}

// ranking.php 单个图片块加载字典数据
interface ItemType extends ItemTypeP1 {
  work: {
    id: number;
    page: string;
    img: string;
    rank: number;
    title: string;
    // 是否已浏览过
    haveRead: boolean;
  };
  user: {
    uid: number;
    author: string;
    // 是否已浏览过
    haveRead: boolean;
  };
}

// 时间加载数据
interface TimeRePositionType {
  // 当前轮次加载的页面
  pages: number[];
  // 运行完成当前轮次请求后等待时间
  time: number;
}

let instance: ComponentInternalInstance | null;

export default defineComponent({
  name: "dateItem",
  components: { dateImg },
  data(): {
    // 日期
    date: null | string;
    // 所有的图片块加载字典数据
    Item: null | ItemType[];
    // 时间加载数据
    object_core: TimeRePositionType[];
  } {
    return {
      date: null,
      Item: null,
      object_core: this.object_core_get(),
    };
  },
  methods: {
    /**
     * @function
     * @async
     * @param page {number} 页面
     * @return {Promise<ItemTypeP1[]>} 一页ranking.php 图片块加载字典数据
     * @description 获取一页ranking.php 图片块加载字典数据<过程1>
     */
    getItem: async function (page: number): Promise<ItemTypeP1[]> {
      let response;
      try {
        // ranking.php
        response = await superagent
          .get(`${RePixivOrigin}ranking.php`)
          .query({
            mode: "daily",
            date: this.date,
            format: "json",
            content: "illust",
            p: page,
          })
          .set("accept", "text/json");
      } catch (e) {
        throw new SyntaxError();
      }
      let body: ranking_ud[] = response.body.contents;
      // dev 环境
      if (dev) {
        // url重定向 解决图片referer问题
        body.forEach((p: ranking_ud) => {
          p.url = RePximgOriginP(p.url);
          return p;
        });
      }
      // 储存一页ranking.php 图片块加载字典数据
      let map: ItemTypeP1[] = [];
      for (let i = 0; i < body.length; i++) {
        // ranking.php 获取数据字典类型
        let it: ranking_ud = body[i];
        // 昨天未出现过
        if (it.yes_rank !== 0) {
          continue;
        }
        // 新增数据
        map.push({
          work: {
            id: it.illust_id,
            page: it.illust_page_count,
            img: it.url,
            rank: it.rank,
            title: it.title,
          },
          user: { uid: it.user_id, author: it.user_name },
        });
      }
      // 返回数据
      return map;
    },
    /**
     * @function
     * @async
     * @description 获取所有页ranking.php 图片块加载字典数据
     */
    async getItems(): Promise<void> {
      // 所有的图片块加载字典数据 清空
      this.Item = [];
      // console.log(JSON.stringify(this.object_core));
      for (
        let i = 0, idAll: string[], uidAll: string[];
        i < this.object_core.length;
        i++
      ) {
        // 当前轮次 时间加载数据
        const objectCoreS: TimeRePositionType = this.object_core[i];
        // 当前轮次 多页ranking.php 单个图片块加载字典数据<过程1>
        const maps: ItemTypeP1[][] = [];
        // 当前轮次 多页ranking.php 单个图片块加载字典数据
        const cmap: ItemType[] = [];
        // 获取 当前轮次 多页ranking.php 单个图片块加载字典数据<过程1>
        for (let j = 0; j < objectCoreS.pages.length; j++) {
          maps.push(await this.getItem(objectCoreS.pages[j]));
        }
        // 获取 服务器中所有的ID和UID
        [idAll, uidAll] = await Promise.all([getIdAll(), getUidAll()]);
        // 获取 获取本地浏览uid数据
        const fUid = `,${getLocalUid()},`;
        // 获取 获取本地浏览id数据
        const fId = `,${getLocalId()},`;

        // 单个图片块加载字典数据<过程1> => 单个图片块加载字典数据
        for (let j = 0; j < maps.length; j++) {
          // 单页 图片块加载字典数据<过程1>
          const map: ItemTypeP1[] = maps[j];
          for (let k = 0; k < map.length; k++) {
            // 单个图片块加载字典数据<过程1>
            const it: ItemType = map[k] as ItemType;
            if (
              // 服务器中uid未匹配到
              uidAll.indexOf(it.user.uid.toString()) === -1 &&
              // 服务器中id未匹配到
              idAll.indexOf(it.work.id.toString()) === -1
            ) {
              // uid是否已浏览过
              it.user.haveRead = fUid.indexOf(`,${it.user.uid},`) !== -1;
              // id是否已浏览过
              it.work.haveRead = fId.indexOf(`,${it.work.id},`) !== -1;
              // 单个图片块加载字典数据
              cmap.push(it);
            }
          }
        }

        // console.log(cmap.length);
        // 加载 当前轮次 多页ranking.php 单个图片块加载字典数据
        this.Item = this.Item.concat(cmap);
        // 当前轮次 等待时间
        await sleep(objectCoreS.time);
      }
    },
    /**
     * @function
     * @async
     * @description 日期更改 并重新发起请求 获取图片
     */
    async changeDate(): Promise<void> {
      // 更改search
      UrlParam.setHistory("date", this.date!);
      // 更改title
      document.title = `pixiv - ${this.date!.substring(
        0,
        4
      )}年${this.date!.substring(4, 6)}月${this.date!.substring(
        6,
        8
      )}日 排行榜`;
      // 重新发起请求 获取图片
      await this.getItems();
    },
    /**
     * @function
     * @return {TimeRePositionType[]} 时间加载数据
     * @description 获取时间加载数据
     */
    object_core_get(): TimeRePositionType[] {
      // 页面总数
      // 生产环境下只加载一页
      const PageNum = dev ? 1 : 10;
      // const page_pic_num = 50;
      // 图片第一次加载平均时间要求
      const InitPicLoadTime = 500;
      // ResistanceGear>-1
      // 对图片加载平均时间要求越来越短
      // 2/2 3/2 4/2 5/2
      // 1   2   3   4
      // 2/2 3/4 4/6 5/8
      // (n+1)/(2*n)
      const ResistanceGear = 1;
      // 时间加载数据
      const objectCore: TimeRePositionType[] = [];
      // 一轮次 时间加载数据
      let objectCoreS: TimeRePositionType = {
        pages: [],
        time: 0,
      };
      // 递增序列
      let add = 1;
      // 页面序列 page
      for (let page = 1, end = 1; ; page++) {
        // 结束
        let br = page <= PageNum;
        if (br) {
          // 增加 页面序列
          objectCoreS.pages.push(page);
        }
        // 递增序列 等于 本轮结束递增序列
        if (add === end) {
          // 重置
          // 递增序列
          add = 1;
          if (br) {
            // 本轮结束后等待时间
            objectCoreS.time =
              ((end + ResistanceGear) / (1 + ResistanceGear)) * InitPicLoadTime;
            // 本轮 时间加载数据
            objectCore.push(objectCoreS);
          } else {
            // 长度检测
            if (objectCoreS.pages.length !== 0) {
              // 本轮结束后等待时间 0
              objectCoreS.time = 0;
              // 本轮 时间加载数据
              objectCore.push(objectCoreS);
            }
            // 结束
            break;
          }
          // 本轮结束递增序列
          end++;
          // 重置
          // 一轮次 时间加载数据
          objectCoreS = {
            pages: [],
            time: 0,
          };
        } else {
          // 递增序列
          // 递增
          add++;
        }
      }
      // 返回
      return objectCore;
    },

    /**
     * @see change_date_by_data_position
     * @see change_date_by_data_position_end
     */
    change_date_by_data_position_end(param: unknown): void {
      (async () => {
        // data
        this.date = param as string;
        await this.changeDate();
      })();
    },
    /**
     * @see change_date_by_data_jump
     * @see change_date_by_data_jump_end
     */
    change_date_by_data_jump_end(param: unknown): void {
      (async () => {
        // data
        this.date = param as string;
        await this.changeDate();
      })();
    },
  },
  async created(): Promise<void> {
    // 获取日期
    this.date = UrlParam.get("date");
    // 未获取到日期
    if (this.date === null) {
      // 更改标题
      document.title = "选择日期";
    } else {
      // 发起请求
      await this.changeDate();
    }
  },
  mounted() {
    instance = getCurrentInstance();

    /**
     * @see change_date_by_data_position
     * @see change_date_by_data_position_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "change_date_by_data_position",
      this.change_date_by_data_position_end
    );
    /**
     * @see change_date_by_data_jump
     * @see change_date_by_data_jump_end
     */
    instance!.proxy!.$NativeEventBus.on(
      "change_date_by_data_jump",
      this.change_date_by_data_jump_end
    );
  },
  beforeUnmount() {
    instance!.proxy!.$NativeEventBus.off(
      "change_date_by_data_position",
      this.change_date_by_data_position_end
    );
    instance!.proxy!.$NativeEventBus.off(
      "change_date_by_data_jump",
      this.change_date_by_data_jump_end
    );
  },
});
</script>

<style scoped>
.item {
  margin: 10% 5%;
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}
</style>
