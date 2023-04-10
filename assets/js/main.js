// Tải dữ liệu từ tệp JSON
const Api = "data.json";

const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);

const listProducts = $(".list__product");// lấy thẻ block chưa data render browser

(function start() {
  getCourses();
})();

//functions render data to Browser

function getCourses() {
  fetch(Api)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      const Data = data.shoes;//chọt vô shoes lấy data

      const htmls = Data.map((item) => {
        return `
        <div class="product__item col l-4 m-6 c-12" id="${item.id}">
         
             <div class="product__img" style="background-color:${item.color} ;"> <img src=${item.image} id=${item.id} alt='hinh san pham'/></div>
              <h4 class="product__text">${item.name}</h4>  
              <p class="product__des">${item.description}</p>  
             
              <div class="product__pricart">
                  <p class="product__pri">${item.price}</p>  
                  <p class="$">$</p>
                  <button id=${item.id} class="cart__btn" >Add to cart</button>
                  <div id=${item.id} class="checkpd disable"><img src="./assets/icon/check.png" alt="check"/></div>
              </div>
        </div>
        
        `;
      });

      listProducts.innerHTML = htmls.join("");// nối các block data từ api bằng  ' ' 
    });
}
setTimeout(() => {// time delay để chọt vô dom xử lí event
  const cartbtn = $$(".cart__btn");// lấy danh sách các nút add cart
  const checbtnpd = $$(".checkpd");// lấy danh sách các nút check

  (function start() {
    handleClickbtnCart();
  })();

  // hàm xử lí click btn add cart để get thông tin sản phẩm ra cart
  function handleClickbtnCart() {
    for (let item of cartbtn) { // duyệt qua tất cả các nút add cart
      item.addEventListener("click", (e) => {
        const checkbtn = e.target; // lấy chính nút nhận event click

        // ẩn btnadd
        item.classList.add("disable"); // ẩn nút add sau khi lick

        const parentBtn = checkbtn.parentNode.parentNode; // trỏ tới element cha chứa thông tin sản phẩm (img text price ...)

        //get btn check
        var btncheck = parentBtn.querySelector(".checkpd");
        btncheck.classList.remove("disable"); //show check btn

        //get style color
        const styleBg = parentBtn.querySelector(".product__img");
        const backgroundColor = styleBg.style.backgroundColor;
        console.log(backgroundColor);
        //get src img
        const imageProduct = parentBtn.querySelector("img");
        const srcImg = imageProduct.src;
        //get id
        var idItem = imageProduct.id;
        console.log(idItem);

        //get textName
        const nameProduct = parentBtn.querySelector("h4");
        const textProduct = nameProduct.textContent;
        //get textPrice
        const priceProduct = parentBtn.querySelector(".product__pricart p");
        const textPrice = priceProduct.textContent;

        const blockCart = $(".list__product__cart"); // lấy thông tin thẻ chưa các sản phẩm add vô cart
        console.log(blockCart);

        const creatDiv = document.createElement("div"); // tạo một khối div bao quanh lấy item trong cart
        creatDiv.id = "item__Cart"; // thêm id vào div
        // tạo một biến chưa code html để render ra giao diện
        const blockhtml = `
         <div class="cart__block__img" style="background-Color:${backgroundColor}">
               <img src=${srcImg} />
         </div>
         <div class="cart__block__info">
              <p>${textProduct}</p>
              <p><span class="price">${textPrice}</span></p>
              <div class="info--icon">
                        <p class="decrease-js" id=${idItem}>-</p>
                        <p class="result-js">1</p>
                        <p class="increase-js" >+</p>
                        <div class="icon--remove" >
                          <img id=${idItem} src="./assets/icon/trash.png"/>
                        </div>
              </div>

         </div>
         
        `;
        creatDiv.innerHTML = blockhtml; // thêm code html vào thẻ div vừa tạo bên trên với nội dung là doạn code html
        blockCart.appendChild(creatDiv); // tạo thêm 1 phần tử con vào phần tử cha bao quanh nó

        RemovetextCart(); // hàm xóa text khi có sản phẩm
        removeItemCart(); // hàm xóa sản phẩm khi click nut xóa
        handleClickiconTrash(); // hàm toggle nut add vs check sản phẩm khi click nut xóa
        handleIncreaAndDereac(); // ham tăng giảm + -
        totalPrice();// hàm tính giá tiền
      });
    }
  }
  //hàm tính tổng tiền
  function totalPrice(){
    const listItemcart = $$(".list__product__cart > div  ");// lấy tất cả các item có trong giỏ hàng
    let sumToltal = 0;
    console.log(listItemcart);
    for(let i = 0; i < listItemcart.length; i++) {//duyệt lần lượt các item trong giỏ hàng
      let valuePrice = listItemcart[i].querySelector(".price").textContent //lấy giá của sản phẩm
      let slProduct = listItemcart[i].querySelector(".result-js").textContent//lấy số lượng sản phẩm
      let tolTal = valuePrice * slProduct;// tính tổng tiền

      sumToltal = sumToltal + tolTal;

    }
    const resultTotal = $('h2 span');// lấy thẻ chưa giá tiền
    resultTotal.textContent = sumToltal.toFixed(2);// gán lại giá trị mới


  }

  function handleIncreaAndDereac() {
    let currentValue = 0; 
    const incr = $$(".increase-js");
    const decr = $$(".decrease-js");
    const resultP = $$(".result-js");
    for (let m of incr) { // duyệt qa tất cả dấu +
      m.addEventListener("click", () => {// nhận event click
        currentValue++;
        resultP.forEach((element) => {
          element.textContent = currentValue;
        });
        totalPrice();// tăng giá tiền khi click +
      });
    }
    for (let n of decr) {
      n.addEventListener("click", (e) => {// nhận event khi click -
        --currentValue;
        for (let item of resultP) {
          item.textContent = currentValue;
        }
        if (currentValue == 0 || currentValue == -1) { // kiểm tra xem nếu như giảm tới 0 or -1 thì xóa toàn bộ sản phẩm
          const listCartBlocks = $(".list__product__cart");
          const des = e.target;//lấy nút click chính nó
          const parentItemcarts = des.parentNode.parentNode.parentNode; //lay ra the cha chứa chính nó
          listCartBlocks.removeChild(parentItemcarts);// xóa thẻ con từ thẻ cha
          RemovetextCart();// kiểm tra để ẩn hiện text 
          const iddes=e.target.id;// lấy id của icon (-)
          console.log(iddes);
           for (let w of cartbtn) {
             // duyệt btn add
             var idw = w.id; // lấy id của btn add
             for (let r of checbtnpd) {
               // duyệt song song btn check
               var idr = r.id; // lấy id của btn check
               if (iddes == idr && idr == idw) {
                 // nếu như id của add bằng checkk == id của icon rác thì thực hiện hành vi
                 w.classList.remove("disable");
                 r.classList.add("disable");
               }
             }
           }
        }
        totalPrice();// tính lại giá tiền khi lick -
      });
    }
  }

  function RemovetextCart() {
    // xóa text khi trong cart có sản phẩm

    const ParentBlock = $(".list__product__cart");
    const ChildBlock = ParentBlock.querySelector(":first-child");
    const textCartcontent = $(".app__cart h4");

    if (ChildBlock !== null) { // kiểm tra xem nếu có phần tử đầu tiên thì xóa text
      return textCartcontent.classList.add("disable");
    } else {//nếu k có phần tử đầu tiên thì hiện text
      return textCartcontent.classList.remove("disable");
    }
  }

  // xóa item trong list cart khi click icon rác trong list cart
  function removeItemCart() {
    const iconRemove = $$(".icon--remove");// láy icon rác
    const listCartBlock = $(".list__product__cart"); //get element cha chưa icon

    for (let item of iconRemove) {
      item.addEventListener("click", (e) => {
        //duyệt qa tất cả các icon rác và click vào chính nó
        const iconRemove = e.target;
        const parentItemcart = //lay ra the cha chứa chính nó
          iconRemove.parentNode.parentNode.parentNode.parentNode;

        listCartBlock.removeChild(parentItemcart); //xoa element con khỏi element cha
         totalPrice();// tính lại giá tiền
        RemovetextCart();// ẩn hiện text 
      });
    }
    
  }

  // event xử lí khi click icon rác sẽ toggle 2 nút btn add và check
  function handleClickiconTrash() {
    const iconRemove = $$(".icon--remove");
    console.log(iconRemove);
    iconRemove.forEach((element) => {
      // duyệt kiểm tra tất cả các icon rác
      element.addEventListener("click", (e) => {
        let idelement = e.target.id; // lấy id của thẻ chưa icon khi click
        console.log(idelement);
        for (let w of cartbtn) {
          // duyệt btn add
          var idw = w.id; // lấy id của btn add
          for (let r of checbtnpd) {
            // duyệt song song btn check
            var idr = r.id; // lấy id của btn check
            if (idelement == idr && idr == idw) {
              // nếu như id của add bằng checkk == id của icon rác thì thực hiện hành vi
              w.classList.remove("disable");
              r.classList.add("disable");
            }
          }
        }
      });
    });
  }
}, 1000);
