function init(){
    function uploadAvatar(){
        var temp=$("input[type='file']")
        temp.click()
        temp.change((event)=>{
            $("#uploadPic").show()
        })
    }
    $("#profilePic").click((event)=>{
        uploadAvatar()
    })

}

window.onload=(event)=>{
    console.log("initializing")
    init()
}