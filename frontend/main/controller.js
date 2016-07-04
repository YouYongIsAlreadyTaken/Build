var logger = require('./modules/logger.js');
AppData.allBuilds = [];
loadBuilds();

vm.updateSettings = function(){
    AppState.go('settings');
}
vm.isSubscribed = function(category){
    if(AppSettings.current){
        //console.log(AppSettings.current, category.categoryName, isSubscribed(category.categoryName));
        return isSubscribed(category.categoryName);
    }else{
        return false;
    }
} 
vm.onConnectionStatusChanged = function(oldStatus,newStatus){
    if(newStatus ==='opened'){
        loadBuilds();    
    }
}
vm.onAppServerNotify = function (message) {
    if (message.type !== 'DELETE' && message.data.status === 'failed' && isSubscribed(message.data.category)) {
        if (cordova.plugins.backgroundMode.isActive()) {
            $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Build Failed',
                text: (message.data.category ? message.data.category + ' >' : '')
                    + message.data.build_name
                    + ' #' + message.data.build_number,
                data: {
                    customProperty: message.data._id
                }
            }).then(function (result) {
                // ...
            });
        }
    }
    $timeout(function () {
        AppData.allBuilds = _.reject(AppData.allBuilds, function (build) {
            return build.build_name === message.data.build_name;
        });
        if (message.type !== 'DELETE') {
            AppData.allBuilds.push(message.data);
        }
        mapCategories();
    });
}
vm.viewCategoryDetail = function (category) {
    AppState.goData('detail', { category: category });
}
function isSubscribed(categoryName){
   return _.any(AppSettings.current.subscribed,function(item){return item.category === categoryName && item.checked ;});
}
function mapCategories() {
    var grouped = _.groupBy(AppData.allBuilds, function (build) {
        return build.category;
    });
    var mapped = _.map(_.keys(grouped), function (category) {
        var groupeditems = _.groupBy(grouped[category], function (build) {
            return build.group_number;
        });
        return {
            categoryName: category,
            items: _.sortBy(grouped[category], function (build) {
                return build.group_number ? build.group_number * 1000 : 0 + build.group_index;
            }),
            //allCompleted : !_.some(grouped[category],function(build){ return build.status !=='completed';}),
            groups: _.map(_.keys(groupeditems), function (group_number) {
                return {
                    group_number: group_number,
                    items: _.sortBy(groupeditems[group_number], function (build) {
                        return build.group_index;
                    })
                };
            })
        };
    });
    AppData.categories = mapped;
    vm.categories = AppData.categories;
};
function loadBuilds() {
    AppService.get().then(function (respond) {
        AppData.allBuilds = respond.data;
        mapCategories();
    });
}

logger.log('I am here and I am ready!');


