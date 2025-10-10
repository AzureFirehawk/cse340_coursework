const pool = require("../database/");

/******************************
 * Add vehicle to favorites
 **************************** */
async function addFavorite(account_id, inv_id) {
    try {
        const sql = `
            INSERT INTO public.favorites (account_id, inv_id) 
            VALUES($1, $2)
            ON CONFLICT(account_id, inv_id) DO NOTHING
            RETURNING *;
        `;
        const data = await pool.query(sql, [account_id, inv_id]);
        return data.rows[0];
    } catch (error) {
        new Error("Add Favorite Error");
    }
}

/******************************
 * Remove vehicle from favorites
 **************************** */
async function removeFavorite(account_id, inv_id) {
    try {
        const sql = `
            DELETE FROM public.favorites
            WHERE account_id = $1 AND inv_id = $2
            RETURNING *;
        `;
        const data = await pool.query(sql, [account_id, inv_id]);
        return data.rows[0];
    } catch (error) {
        new Error("Remove Favorite Error");
    }
}

/* ****************************
 * Get favorites by account id
 * ************************** */
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `
            SELECT i.* FROM public.favorites AS f
            JOIN public.inventory AS i
            ON f.inv_id = i.inv_id
            WHERE f.account_id = $1;
        `;
        const data = await pool.query(sql, [account_id]);
        return data.rows;
    } catch (error) {
        new Error("Get Favorites Error");
    }
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavoritesByAccountId,
};