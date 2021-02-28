Vue.component('shoppingcartwrapper', {
  data() {
    return {
    }
  },
  props: {
    shopping_cart: Boolean,
    customer_shopping_cart: Array,
  },
  methods: {
    // 傳給父元件，購物車要刪除的Obj
    emitObjHandler(item) {
      this.$emit('obj', item)
    },
  },
  computed: {
    // 計算購物車內的總價格
    countTotal() {
      let countTotal = 0;
      for (let i in this.customer_shopping_cart) {
        countTotal += parseInt(this.customer_shopping_cart[i].price * this.customer_shopping_cart[i].num);
      }
      return countTotal;
    },
    // 消費者購物欄是否為空
    shopEmtpy() {
      if (this.customer_shopping_cart.length === 0) {
        return false
      } else {
        return true
      }
    },
  },
  template: `
  <transition name="move">
  <div class='shoppingCartWrapper' v-show="shopping_cart">
        <div class="shoppingCart">購物車</div>
        <div class="shoppingCartIntroduction">
          <div class="shopinggCartImg">圖片</div>
          <div class="shopinggCartTitle">名稱</div>
          <div class="shopinggCartPrice">價格</div>
          <div class="shopinggCartNum">數量</div>
          <div class="shopinggCartNum">小計</div>
          <div class="shopinggCartDelete">刪除</div>
        </div>

        <ul>
          <li v-for="item of customer_shopping_cart" :key="customer_shopping_cart.id">
            <div class="shopinggCartImg">
              <img :src="item.src[0]">
            </div>
            <div class="shopinggCartTitle">
              <div class="inlineBlock">{{item.title}}</div>
            </div>
            <div class="shopinggCartPrice">
              <div class="inlineBlock">NT:{{item.price}}</div>
            </div>
            <div class="shopinggCartNum">
              <div class="inlineBlock">{{item.num}}</div>
            </div>
            <div class="shopinggCartNum">
              <div class="inlineBlock">{{item.price * item.num}}</div>
            </div>
            <div class="shopinggCartDelete">
              <div class="inlineBlock" @click="emitObjHandler(item)">刪除</div>
            </div>
          </li>
          <li v-show="shopEmtpy" class="shopinggCartTotlePrice">
            <div>
              總計: {{countTotal}}
            </div>
          </li>
        </ul>

      </div>
      </transition>
  `,
})