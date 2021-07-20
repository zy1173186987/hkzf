import axios from "axios"

export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if (!localCity) {
        return new Promise((resolve, reject) => {
            // 通过IP定位获取到当前城市名称
            const curCity = new window.BMapGL.LocalCity()
            curCity.get(async res => {
                try {
                    const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
            
                    // 存储到本地存储中
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    // 返回该城市数据
                    resolve(result.data.body)
                } catch (e) {
                    // 获取定位城市失败
                    reject(e)
                }
            })
        })
    }
    // 注意：因为上面为了处理异步操作，使用了Promise。因此为了该函数返回值的统一，此处也应该使用Promise
    // 以为此处的Promise不会失败，所以此处只要返回一个成功的Pro貌似额即可
    return Promise.resolve(localCity)
}