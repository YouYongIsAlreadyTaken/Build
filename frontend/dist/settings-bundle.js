vm.sublist = [];
var settings;
var categories;
AppService.get('/categories').then(function(res){
   categories = res.data;
   AppSettings.getting().then(function (settingsres) {
       console.log(settingsres);
       settings = settingsres.data;
       if(!settings.subscribed){
           settings.subscribed=[];
       }
       var newCategories = _.difference(categories,_.map(settings.subscribed,function(item){return item.category;}));
       _.each(newCategories,function(newCategory){
           settings.subscribed.push({category:newCategory,checked:false});
       });
       vm.sublist = settings.subscribed;
   }).catch(function(err){
       console.log(err);
   }); 
});

vm.updateSettings = function(){
    settings.subscribed = vm.sublist;
    console.log(settings);
    AppSettings.setting(settings);
}
