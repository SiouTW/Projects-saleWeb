const Detail = {
  // const Detail = Vue.component('shoppingdetail', {
  data: function () {
    return {
      // 是否讓畫面都灰掉
      displayNoneIsActive: false,
      // 購物車顯示狀態
      shopping_cart: false,
      // 所有產品
      posts: saleContents,
      // 消費者的購物車
      customer_shopping_cart: [],
      // 網頁暫存的購物車
      localStorageShoppingCart: [],
      // 購物車商品的總價
      totalPrice: 0,
      // 是否要顯示商品或退換貨政策
      isCommodityOn: true,
      // 商品ID
      postsofnum: this.$route.params.title,
      // 第幾張圖片
      imgNum: 0,
    }
  },
  props: ['title'],
  methods: {
    // 背景變暗
    changeDisplay() {
      this.displayNoneIsActive = !this.displayNoneIsActive
      this.shopping_cart = false
      this.smallSellBox = false
    },
    // 顯示購物車 和 背景變暗
    displayShoppingCart() {
      this.displayNoneIsActive = !this.displayNoneIsActive
      this.shopping_cart = !this.shopping_cart
    },
    // 傳消費者要購買的商品對象
    objHandler(post) {
      // newCartItem 顧客要買的新商品
      const newCartItem = Object.assign({}, post);
      let newQua = post.num;
      // 整個購物車都倒出來檢查
      for (let i in this.customer_shopping_cart) {
        // 如果商品編號相同
        if (this.customer_shopping_cart[i].id === post.id) {
          // 增加使用者想購買的數量
          newQua = parseInt(this.customer_shopping_cart[i].num) + newQua;
          // 刪除陣列中相同的商品
          this.customer_shopping_cart.splice(i, 1);
        }
      }
      newCartItem.num = newQua;
      this.customer_shopping_cart.push(newCartItem);
      this.displayShoppingCart()
      localStorage.setItem('shoppingCart', JSON.stringify(this.customer_shopping_cart));
    },
    // 刪除使用者購物車裡的商品
    deleteItemInCart(item) {
      let newNum = 0, newRemaning = 0
      var newIndex = 0
      for (let i in this.posts) {
        if (item.id === this.posts[i].id) {
          newNum = this.posts[i].num + item.num
          newRemaning = this.posts[i].remaining + item.num
          newIndex = this.posts.indexOf(this.posts[i])
        }
      }
      this.customer_shopping_cart = this.customer_shopping_cart.filter((id) => {
        return id != item
      })
      this.posts[newIndex].num = newNum
      this.posts[newIndex].remaining = newRemaning

      localStorage.setItem('shoppingCart', JSON.stringify(this.customer_shopping_cart));
    },
    // 關閉商品欄，打開購物須知
    isCommodityOnFalse() {
      this.isCommodityOn = false
    },
    isCommodityOnTrue() {
      this.isCommodityOn = true
    },
    // 切換左側圖片
    switchPicture(index) {
      this.imgNum = index
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
  },
  mounted() {
    // 複製 localStorage 裡的資料到 this.customer_shopping_cart
    if (localStorage.getItem('shoppingCart')) {
      this.customer_shopping_cart = JSON.parse(localStorage.getItem('shoppingCart'));
      // 把所有 this.customer_shopping_cart 裡的數量直接扣掉現在網頁裡的數量
      for (let i in this.customer_shopping_cart) {
        for (let y in this.posts) {
          if (this.customer_shopping_cart[i].id === this.posts[y].id) {
            this.posts[y].remaining = this.posts[y].remaining - this.customer_shopping_cart[i].num
          }
        }
      }
    }


  },
  beforeMount() {
    this.posts;
  },
  created() {
    this.posts[this.postsofnum].num = 1;
  },
  template: `
  <div id="detail">
  <!-- 左邊 -->
  <div class="content">
    <div class="pictureWrapper">
      <img class="bigPicture" :src="posts[postsofnum].src[imgNum]" alt="圖片">
    </div>
    <!-- 右邊 -->
    <div class="detail">
      <h1>{{posts[postsofnum].title}}</h1>
      <div class="price">$ {{posts[postsofnum].price}}</div>
      <div class="picker" v-if="posts[postsofnum].remaining">
        <label for=""></label>
        <select v-model.number="posts[postsofnum].num">
          <option :value="num" v-for="num in posts[postsofnum].remaining" :key="num">{{num}}</option>
        </select>
      </div>
      <div class="soldOut" v-else>售完</div>
      <div class="description">
        <h2>描述:</h2>
        <p>這件衣服的優點。</p>
      </div>
      <div class="description2">
        <h3>產品特色</h3>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>
      <button v-if="posts[postsofnum].remaining" @click="objHandler(posts[postsofnum])">加入購物車</button>
      <button v-else>聯絡我們</button>
    </div>

  </div>
  <!--  -->
  <div class="imgGroup">
    <img :src="img" @click="switchPicture(index)" v-for="(img,index) of posts[postsofnum].src">
  </div>

  <!-- 右上角會員相關 -->
  <div id="fixed-topBar">
    <button @click='changeDisplay'>會員登入</button>
    <button @click='displayShoppingCart'>購物車</button>
    <button @click='changeDisplay'>聯絡我們</button>
  </div>

  <!-- 背景變淡 -->
  <transition name="fade">
    <div class='coverAll' v-show='displayNoneIsActive' @click='changeDisplay'></div>
  </transition>

  <!-- 購物車 -->
  <shoppingcartwrapper :shopping_cart='shopping_cart' :customer_shopping_cart='customer_shopping_cart'
    @obj="deleteItemInCart"></shoppingcartwrapper>

  <router-link :to='{name:"index"}' class='previousPage'>上一頁</router-link>

</div>
  `
}