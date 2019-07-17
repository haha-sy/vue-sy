import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    MenuItem,
    Submenu
} from 'element-ui'

Vue
    .use(Button)
    .use(Form)
    .use(FormItem)
    .use(Input)
    .use(Container)
    .use(Header)
    .use(Aside)
    .use(Main)
    .use(Menu)
    .use(MenuItem)
    .use(Submenu)

Vue.prototype.$message = Message
