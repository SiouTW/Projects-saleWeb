// 首頁的商品欄
const Commodity = Vue.component('commodity', {
  data() {
    return {
      // 購物盒是否顯示
      smallSellBox: false,
      // 圖片放到最大
      maxSize: false,
      // 購買數量
      quantity: 1,
      min: 1,
      firstPicture: this.post.src[0],
      showGray: false,
      outOfStocka: null,
      allGoods: saleContents,
      // csc: this.customer_shopping_cart,
      cc: this.csc,
    }
  },
  props: ['post', 'csc'],
  methods: {
    // 顯示小購物框和背景變灰
    displaySmallSellBox() {
      if (this.maxSize) {
        return this.maxSize = false
      }
      this.smallSellBox = !this.smallSellBox
      this.showGray = !this.showGray
      // 每次打開都把購物車數量重製為1
      if (this.post.remaining >= 1) {
        this.quantity = 1
      }
    },
    // 以下為數量的加減
    addQuantity() {
      this.verifiedQuantity++;
    },
    subQuantity() {
      this.verifiedQuantity--;
    },
    // 切換小購物框裡的左邊圖片
    switchPicture(img) {
      this.firstPicture = img
    },
    // 顯示商品的大圖片
    displayMax() {
      this.maxSize = !this.maxSize
    },
    // 傳給父元件，購物車要增加的Obj
    emitObjHandler() {
      this.post.num = this.quantity
      this.post.remaining = this.post.remaining - this.post.num
      this.$emit('obj', this.post)
      this.displaySmallSellBox()
    },
    // 計算是否還有庫存
    isEmpty() {
      // 先檢查商品是否有庫存
      if (this.allGoods[this.post.id].remaining == this.allGoods[this.post.id].num) {
        this.outOfStocka = true;
      } else {
        for (let i = 0; i < this.csc.length; i++) {
          // 檢查購物車的內容是否和該component相同
          if (this.csc[i].id === this.post.id) {
            // 購物車內的商品購買數量>=商品剩餘數量
            if (this.allGoods[this.post.id].remaining <= this.csc[i].num) {
              this.outOfStocka = true;
            } else {
              this.outOfStocka = false;

            }
          }
        }
      }
    }
    // if (this.allGoods[this.post.id].remaining == this.post.num) {
    //   this.outOfStock = true;
    //   console.log(this.allGoods[this.post.id].remaining == this.post.num);
    //   console.log(this.allGoods[this.post.id].remaining, this.post.num);
    // }
    // else {
    //   this.outOfStock = false;
    //   console.log(this.allGoods[this.post.id].remaining == this.post.num);
    //   console.log(this.allGoods[this.post.id].remaining, this.post.num);
    // }

  },
  computed: {
    // 對過的數量 ?
    verifiedQuantity: {
      get() {
        return this.quantity;
      },
      set(value) {
        if (!value || typeof value === 'string') {
          return false;
        } else if (value >= this.min && value <= this.post.remaining) {
          this.quantity = value;
        }
      }
    },
  },

  // beforeCreated() {
  //   this.isEmpty()
  // },

  beforeMount() {
    this.isEmpty()
  },
  updated() {
    this.isEmpty()
  },
  template: `
  <div class="commodity">
  <router-link :to="{name: 'detail', params: { title:post.id,postsofnum:post.id }}" class="a">

      <div class="image-wrapper">
        <div class="image" :style="{backgroundImage: 'url('+ post.src[0] +')' }" :class='{outOfStock:outOfStocka}'>
        </div>
        <div class="add-to-cart" v-if='post.remaining>0' @click.prevent='displaySmallSellBox'>加入購物車</div>
        <div class="sold-out" v-show='post.remaining<=0'>售完</div>
      </div>

      <div class="info-box">
        <div class="info-box-name">{{post.title}}</div>
        <div class="info-box-price">NT$ {{post.price}}</div>
      </div>

      </router-link>

    <div class="smallSellBoxWrapper" v-if="smallSellBox">
    <img :src="firstPicture" v-if="maxSize" class="topOfPicture" @click="displayMax">
    <div class="smallSellBox">

    <div class="componentCoverAll" v-show="showGray" @click="displaySmallSellBox"></div>


      <div class="relative">
        <div class="flex">
          <div class="left" @click="displayMax">
            <img :src="firstPicture">
          </div>
          <div class="right">
            <h3>{{post.title}}</h3>
            <h4>NT$ {{post.price}}</h4>
            <div class="CommodityDescription">
              <p>商品敘述</p>
            </div>
            <div class="inputGroup">
              <h4>數量:</h4>
              <button @click="subQuantity">-</button>
              <input type="number"
              v-model.number="quantity">
              <button @click="addQuantity">+</button>
            </div>
            <button class="confirmAdd" @click="emitObjHandler">加入購物車</button>
            <h5>現庫存只剩下 {{post.remaining}} 件</h5>
            <div class="imgControl">

              <div class="imgGroup" ref="box">
                <img :src="img" @click="switchPicture(img)" v-for="img of post.src">
              </div>

            </div>
          </div>
        </div>
        <div class="close" @click="displaySmallSellBox">X</div>
      </div>
    </div>

    </div>

  </div>
  `
})

// 首頁的內容
const Allpage = {
  data() {
    return {
      // 是否讓畫面都灰掉
      displayNoneIsActive: false,
      // 購物車顯示狀態
      shopping_cart: false,
      // 商品顯示的類型
      filterType: 'all',
      // show: false,
      allGoods: saleContents,
      posts: saleContents,
      // 以下都是產品數量
      numOfTotal: 0,
      numOfCoat: 0,
      numOfPants: 0,
      numOfSkirt: 0,
      numOfSock: 0,
      // 消費者的購物車
      customer_shopping_cart: [],
      // 網頁暫存的購物車
      localStorageShoppingCart: [],
      // 購物車商品的總價
      totalPrice: 0,
      // 是否要顯示商品或退換貨政策
      isCommodityOn: true,
      // 要點進去的商品ID
      goodsID: 0,
    }
  },
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
    // 顯示全部產品
    all() {
      this.filterType = 'all'
      this.posts = saleContents
      this.isCommodityOnTrue()
    },
    // 自動篩選:上衣，褲子，裙子，襪子
    autoFilter(String) {
      this.filterType = String
      this.posts = saleContents.filter((item) => {
        if ((item.type) === String) {
          return true;
        }
        return false;
      });
      this.isCommodityOnTrue()
    },
    // 打開網頁時，計算各個商品類型的數量
    calculationAllOfNumber() {
      let value = 0, numCoat = 0, numPants = 0, numSkirt = 0, numSock = 0
      this.filterType = 'all'
      this.posts = saleContents.filter((post) => {
        value++
        if ((post.type) === 'coat') {
          numCoat++
          return true;
        } else if ((post.type) === 'pants') {
          numPants++
          return true;
        } else if ((post.type) === 'skirt') {
          numSkirt++
          return true;
        } else if ((post.type) === 'sock') {
          numSock++
          return true;
        } else {
          return true
        }
      });
      this.numOfCoat = numCoat
      this.numOfPants = numPants
      this.numOfSkirt = numSkirt
      this.numOfSock = numSock
      this.numOfTotal = value
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
      //
      post.num = 0;
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
      console.log(this.posts[newIndex].remaining);
      console.log(newRemaning);
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


  },
  computed: {

  },
  mounted() {
    // 打開網頁時，計算各個商品類型的數量
    this.calculationAllOfNumber()
    // 複製 localStorage 裡的資料到 this.customer_shopping_cart
    if (localStorage.getItem('shoppingCart')) {
      this.customer_shopping_cart = JSON.parse(localStorage.getItem('shoppingCart'));
      // 把所有 this.customer_shopping_cart 裡的數量直接扣掉現在網頁裡的數量
      for (let i in this.customer_shopping_cart) {
        for (let y in this.posts) {
          if (this.customer_shopping_cart[i].id === this.posts[y].id) {
            this.posts[y].remaining = this.allGoods[y].remaining - this.customer_shopping_cart[i].num
          }
        }
      }
    }
  },
  updated() {
    this.posts
  },
  template: `
  <div id="allPage">
    <div id="sideBar">
      <div class="bar1">
        <img src="./picture/pig.jpg" alt="商標">
      </div>
      <div class="bar2">
        <ul>
          <li @click="all">所有產品<div class="countNum">{{numOfTotal}}</div>
          </li>
          <li class="thisMonth">產品分類
            <div class="goods">
              <ul>
                <li @click="autoFilter('coat')">上衣<div class="countNum">{{numOfCoat}}</div>
                </li>
                <li @click="autoFilter('pants')">褲子<div class="countNum">{{numOfPants}}</div>
                </li>
                <li @click="autoFilter('skirt')">裙子<div class="countNum">{{numOfSkirt}}</div>
                </li>
                <li @click="autoFilter('sock')">襪子<div class="countNum">{{numOfSock}}</div>
                </li>
              </ul>
            </div>
          </li>
          <li @click="isCommodityOnFalse">退換貨政策</li>
          <li><a href="#">IG</a></li>
        </ul>
      </div>
    </div>

    <div id="saleContent">
      <h3 class="title" v-show="filterType=='all'">所有商品</h3>
      <h3 class="title" v-show="filterType=='coat'">上衣</h3>
      <h3 class="title" v-show="filterType=='pants'">褲子</h3>
      <h3 class="title" v-show="filterType=='skirt'">裙子</h3>
      <h3 class="title" v-show="filterType=='sock'">襪子</h3>


      <div class="commodity-wrapper">

        <commodity v-for="post of posts" :post="post" :key="post.id" :csc="customer_shopping_cart" @obj="objHandler" v-show="isCommodityOn">
        </commodity>
        <!-- <router-view></router-view> -->

        <div class="userNeedToKonw" v-show="!isCommodityOn">

        <h2>退換貨政策</h2>
        <p>退換貨政策的內容</p>
        <p>退換貨政策的內容 1</p>
        <p>退換貨政策的內容 2，退換貨政策的內容 2</p>

        <h2>退換貨Q&A</h2>
        <p>退換貨Q&A</p>
        <p>Q1: .......................，.......................</p>
        <p>A1: ...........，...........</p>
        <p>Q2: ...........，...........，...........</p>
        <p>A2: .......................</p>

        <ul>
          <li>以下為非瑕疵狀況</li>
        </ul>

        <p>───────────────────────────────────────────────────────────────────────────────</p>
        <p>換貨程序</p>
        <ol>
          <li>1. 換貨程序1</li>
          <li>2. 換貨程序2，換貨程序2</li>
          <li>3. 換貨程序3，換貨程序3，換貨程序3</li>
        </ol>

        </div>

      </div>
    </div>

    <div id="fixed-topBar">
      <button @click='changeDisplay'>會員登入</button>
      <button @click='displayShoppingCart'>購物車</button>
      <button @click='changeDisplay'>聯絡我們</button>
    </div>

    <transition name="fade">
      <div class='coverAll' v-show='displayNoneIsActive' @click='changeDisplay'></div>
    </transition>

    <shoppingcartwrapper :shopping_cart='shopping_cart' :customer_shopping_cart='customer_shopping_cart'
      @obj="deleteItemInCart">
    </shoppingcartwrapper>
  </div>
  `
}

const router = new VueRouter({
  routes: [
    {
      // 首頁
      path: '/',
      name: 'index',
      component: Allpage,
    },
    {
      // 單獨的商品頁面
      path: '/detail/:title',
      name: 'detail',
      component: Detail,
      props: { default: true },
    }
  ]
})

new Vue({
  el: '#all',
  router,
})

