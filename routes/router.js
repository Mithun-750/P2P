const express=require('express')
const cookieparser=require("cookie-parser")
const path=require('path')
const router=express.Router();
const  app = express();
app.set('view  engine','ejs');
router.use(cookieparser())
router.use(express.static(path.join(__dirname, "public")));
const {gethome,getabout,getfaq,getnews,getfpassword,getuserdata,signout,getcategories,getsearch,getgenre,getgames,getGame}=require("../controllers/home");
const {getuser,postuserpassword,postupdateuser}=require("../controllers/user");
const {getlogin,postlogin}=require("../controllers/login");
const {getregister,postregister}=require("../controllers/register");
const {getregister2,postregister2}=require("../controllers/register2");
const {getadmin,getmanager,getLoginDet,getRegDet,delAcc,updatepassword,updaterole}=require("../controllers/admin_manager");
const {getcart,addtocart,getcartgames,removetocart}=require("../controllers/cart");
const {getgamepage,getproduct,postreview}=require("../controllers/gamepage")
const {def}=require("../controllers/def")
const {getpaymentpage,paygame,downloadgame}=require("../controllers/payment")
const {getuserchatpage,getchat,postsend,getmessages,postmessage,getuserchat}=require("../controllers/chat");

router.get("/admin",getadmin);
router.get("/manager",getmanager);
router.get("/admin/getLoginDet",getLoginDet);
router.get("/admin/getRegDet",getRegDet);
router.post("/admin/updatepassword",updatepassword);
router.post("/admin/delAcc",delAcc);
router.post("/admin/updaterole",updaterole);

router.get("/",def);

router.get("/home",gethome)
router.get("/login",getlogin).post("/login",postlogin);
router.get("/register",getregister).post("/register",postregister);
router.get("/register2",getregister2).post("/register2",postregister2);
router.get("/about",getabout);
router.get("/faq",getfaq);
router.get("/news",getnews);
router.get("/signout",signout);
router.get("/user",getuser);
router.post('/user/password',postuserpassword)
router.get("/fpassword",getfpassword);
router.get("/userdata",getuserdata);
router.post("/updateuser",postupdateuser);


router.get("/games",getgames);
router.get("/search",getsearch);
router.get("/genre",getgenre);
router.get("/categories",getcategories);
router.post("/getGame",getGame);


router.post("/paygame",paygame);
router.post("/downloadgame",downloadgame)
router.get("/game-page/payment",getpaymentpage);
router.get("/game-page",getgamepage);
router.post("/getproduct",getproduct);
router.post("/game-page/postreview",postreview);
router.get("/cart",getcart);
router.post("/addtocart",addtocart)
router.get("/getCartgames",getcartgames);
router.post("/removetocart",removetocart);

module.exports=router;