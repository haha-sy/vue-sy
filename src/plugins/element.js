import Vue from 'vue'
import {
    Alert,
    TableColumn,
    Table,
    Row,
    Col,
    Card,
    Breadcrumb,
    BreadcrumbItem,
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
    Submenu,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Tabs,
    TabPane,
    Steps,
    Step,
    Checkbox,
    CheckboxGroup,
    Upload,
    Timeline,
    TimelineItem

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
    .use(Breadcrumb)
    .use(BreadcrumbItem)
    .use(Card)
    .use(Row)
    .use(Col)
    .use(Table)
    .use(TableColumn)
    .use(Switch)
    .use(Tooltip)
    .use(Pagination)
    .use(Dialog)
    .use(Tag)
    .use(Tree)
    .use(Select)
    .use(Option)
    .use(Alert)
    .use(Cascader)
    .use(Tabs)
    .use(TabPane)
    .use(Step)
    .use(Steps)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Upload)
    .use(Timeline)
    .use(TimelineItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
