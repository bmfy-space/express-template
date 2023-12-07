// 引入mysql2模块
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true, // 是否等待连接
  connectionLimit: 10,  // 连接数限制
  queueLimit: 0, // 没有限制请求队列的最大值，0代表无限制。
});

/**
 * 执行SQL查询语句的通用方法
 * @param {string} sql 要执行的SQL查询语句
 * @param {Array} params 查询参数数组，可选
 * @returns {Promise} Promise对象，包含查询结果或错误信息
 */
async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.query(sql, params);
    return rows;
  } finally {
    // 释放连接
    connection.release();
  }
}

// 执行事务并返回一个Promise
async function startTransaction(callback) {
  let connection;
  try {
    // 获取连接
    connection = await pool.getConnection();
    // 开启事务
    await connection.beginTransaction();
    // 调用传入的回调函数，将连接对象作为参数传递
    await callback(connection);
    // 提交事务
    await connection.commit();
  } catch (error) {
    // 如果发生错误，回滚事务
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    // 释放连接
    if (connection) {
      connection.release();
    }
  }
}

pool.sql = query;
pool.startTransaction = startTransaction;

module.exports = pool;