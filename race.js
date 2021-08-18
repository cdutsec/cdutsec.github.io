const mytable={
    template:`
    <div id="box">
    <el-descriptions :title="obj.game_name" :column="3">
        <el-descriptions-item label="性质">{{obj.property}}</el-descriptions-item>
        <el-descriptions-item label="类型">{{obj.type}}</el-descriptions-item>
        <el-descriptions-item label="主办方">{{obj.sponsor}}</el-descriptions-item>
        <el-descriptions-item label="报名时间" :span="1">{{obj.apply_begin}} 至<br>{{obj.apply_end}}</el-descriptions-item>
        <el-descriptions-item label="比赛时间" :span="1"><p v-html="obj.game_time"></p></el-descriptions-item>
        <el-descriptions-item label="比赛说明" :span="1">{{obj.description}}</el-descriptions-item>
        <el-descriptions-item label="报名链接" :span="3"><a :href="obj.register_url" target="_blank">{{obj.register_url}}</a></el-descriptions-item>
        <el-descriptions-item label="比赛通知链接" :span="3"><a :href="obj.notify_url" target="_blank">{{obj.notify_url}}</a></el-descriptions-item>
    </el-descriptions>
    </div>
    `,
    props:['obj']
}

Vue.component('race_table',{
data() {
    return {}
},
template:`
    <el-table ref="table"  stripe :data="data" style="width: 94%; margin: 0 auto" :default-sort ="{prop:'apply_end',order:'ascending'}">
        <el-table-column label="比赛名称" prop="game_name" min-width="125%"></el-table-column>
        <el-table-column label="比赛性质" prop="property" sortable min-width="40%">
            <template slot-scope="scope">
                <el-tag :type="get_type(scope.row.property)"> {{ scope.row.property}} </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" sortable min-width="40%"></el-table-column>
        <el-table-column label="报名截止日期" prop="apply_end" sortable min-width="50%"></el-table-column>
        <el-table-column label="比赛日期" prop="game_time" sortable>
            <template slot-scope="props">
                <p v-html="props.row.game_time"></p>
            </template>
        </el-table-column>
        <el-table-column label="主办方" prop="sponsor" sortable></el-table-column>
        <el-table-column label="展开" type="expand">
            <template slot-scope="props">
                <mytable :obj='props.row'></mytable>
            </template>
        </el-table-column>
    </el-table>
`,
methods: {
    get_type(s) { //默认"success""info""warning""danger"
        if(s.indexOf("国") >= 0 )
            return "success"
        else if(s.indexOf("省") >= 0 )
            return ""
        else
            return "info"
    }
},
components:{
    mytable
},
props:{
    data: Array
}
})

available_race_data = [];
unavailable_race_data = [];
for(var i=0; i<race_data.length; i++) {
    end_time = race_data[i]["apply_end"]
    var patt1 = new RegExp("^[0-9]+年[0-9]+月[0-9]+日$");
    res = patt1.test(end_time);
    // console.log(end_time, res)
    if(res){
        yyyy=0000
        if(end_time.indexOf("年")>=0){
            yyyy = end_time.split("年")[0]
            mm = end_time.split("年")[1].split("月")[0]
        }
        else{
            mm = end_time.split("月")[0]
        }
        dd = end_time.split("月")[1].split("日")[0]
        // console.log(yyyy, mm, dd)
        var date = new Date()
        year = date.getFullYear()
        month = date.getMonth() + 1 //月份是从0开始的
        day = date.getDate()
        // console.log(year, month, day)
        if(yyyy==0){
            available_race_data.push(race_data[i])
        }else if(yyyy>year || (yyyy==year && mm>month) || (yyyy==year && mm==month && dd>=day)){
            available_race_data.push(race_data[i])
        }
        else{
            unavailable_race_data.push(race_data[i])
        }
    } else {
        available_race_data.push(race_data[i])
    }
}

new Vue({
    el:"#available_race",
    data: {
        dt1: available_race_data
    }
})

new Vue({
    el:"#unavailable_race",
    data: {
        dt2: unavailable_race_data
    }
})
