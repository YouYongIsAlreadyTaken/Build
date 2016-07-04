Object.defineProperty(vm,'category',{
    get:function(){
        return AppStateData.data.category; 
    }
});
Object.defineProperty(vm,'data',{
    get:function(){
        return _.find(AppData.categories,function(obj){ return obj.categoryName === vm.category;});
    }
});
 








