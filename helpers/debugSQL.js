function debugSql(sql, params) {
    let i = 0;
    return sql.replace(/\?/g, () => {
        const val = params[i++];
        return typeof val === 'string' ? `'${val}'` : val;
    });
}

module.exports = { debugSql };