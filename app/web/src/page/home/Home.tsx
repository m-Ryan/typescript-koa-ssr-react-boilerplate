import * as React from 'react';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";
import * as styles from './home.scss';
import { add, del, Book } from '../../model/books';
import {Table, Button } from 'antd';
interface HomeProps extends React.Props<HomeProps> {
   add: Function;
   del: Function;
   books: Array<Book>
}
class Home extends React.Component<HomeProps> {
    constructor(props){
        super(props)
    }
    addBook=()=>{
        const id = this.props.books.length+1;
        let book: Book = {
            id,
            name: `书${id}`,
            price: Math.round(Math.random()*1000)
        }
        this.props.add(book)
    }

    delBook=(id)=>{
        this.props.del(id)
    }

    columns = [
        {
            title: '书名',
            dataIndex: 'name',
            render: text => <a href="javascript:;">{text}</a>
        }, {
            title: 'id',
            dataIndex: 'id',
        }, {
            title: '价格',
            dataIndex: 'price',
        }, {
            title: '操作',
            render: (text, record) => (
                <span onClick={()=>this.delBook(record.id)}>
                    <a href="javascript:;">Delete</a>
                </span>
            )
        }
    ];

   render(){
        const { books } = this.props;
        return (
            <div className={styles.tableContainer}>
                <div className={styles.aboutPage}>goto / <Link to="/about">about</Link></div>
                <Table rowKey={record => record.id} columns={this.columns} dataSource={books}/>
                <p><Button type="primary" onClick={this.addBook}>添加</Button></p>
            </div>
        )
   }
}
const mapState=({ books })=>({books})

export default connect(mapState, {add, del})(Home)
