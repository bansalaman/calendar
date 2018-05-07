import {Dispatcher,Store} from './flux';
import {Calendar} from './calendar.2.js';
import {actionObj} from './flux/actions.js';
const controlPanelDispatcher = new Dispatcher();
var cal = new Calendar();
cal.createCal.cache = {};
export const VIEW_SLOTS = `VIEW_SLOTS`;
export const NOMINATE_ON_SLOTS=`NOMINATE_ON_SLOTS`;
export const GET_MONTH_SLOTS=`GET_MONTH_SLOTS`;
export const UPDATE_SLOT_INFO=`UPDATE_SLOT_INFO`;
let role="hirings";

class CalenderViewStore extends Store {
    getInitialState() {
        return {
            monthSlot:{},
            viewSlot:{},
            nominateOnSlot:{}
        }
    }   
    __onDispatch(action){
        switch(action.type) {
            case VIEW_SLOTS:
                actionObj.viewSlotsActionResponse().then((res)=>{
                    action.data=res;
                    this.__state.viewSlot = action.data;
                    this.__emitChange();
                    });    
                break;
            case NOMINATE_ON_SLOTS:
                actionObj.viewSlotsActionResponse().then((res)=>{
                    action.data=res;
                    this.__state.nominateOnSlot = action.data;
                    this.__emitChange();
                });    
                break;
            case GET_MONTH_SLOTS:
                actionObj.getMonthSlotsActionResponse().then((res)=>{
                    action.data=res;
                    this.__state.monthSlot = action.data;
                    this.__emitChange();
                });    
            break;
            case UPDATE_SLOT_INFO:
                actionObj.getUpdatedSlotInfoResponse(action.data).then((res)=>{
                this.__state.nominateOnSlot = res;
                this.__emitChange();
            });    
        break;
        }
    }
    getUserPreferences(){
            return this.__state;
    }
}

const calenderViewStore = new CalenderViewStore(controlPanelDispatcher);
calenderViewStore.addListener((state)=>{
    render(state);
});

const render = (state)=>{
    //rendering month using state.monthSlot
    if ( $.isEmptyObject(state.monthSlot)){
    }
    else {
        let allAvailable = state.monthSlot.monthDetail.allAvailable.slice();
        let allFull = state.monthSlot.monthDetail.allFull.slice();
        let fewAvailable= state.monthSlot.monthDetail.fewAvailable.slice();
        let noSlots= state.monthSlot.monthDetail.noSlots.slice();
        let currentMonth=$('.curr');
        for(let i=0;i<allAvailable.length;i++){
            currentMonth.find("td:not(.nil):contains('" + allAvailable[i] + "')").find('.color-slots').addClass('all-slots');
        }
        for(let i=0;i<allFull.length;i++){
            currentMonth.find("td:not(.nil):contains('" + allFull[i] + "')").find('.color-slots').addClass('no-slots');
        }
        for(let i=0;i<fewAvailable.length;i++){
            currentMonth.find("td:not(.nil):contains('" + fewAvailable[i] + "')").find('.color-slots').addClass('few-slots');
        }
 
    }
    //rendering time-slots along with panelist email-id(if nominated) using state.viewSlot-for HIRING TEAM
    if($.isEmptyObject(state.viewSlot)){
        
    }
    else {

        $('#modal-hiring-team').find('.view-slot-date').html(state.viewSlot.Date);
       state.viewSlot.listOfSlots.forEach(slot => {
            let $clone = $('#modal-hiring-team').find('.to-clone').clone();
            $clone.removeClass('to-clone');
            $clone.find('.slot-timing').html(slot.startTime+'-'+slot.endTime);
            if(slot.empty=='no') {
                $clone.find('.panelist-email-id').html(slot.emailAddress);
                $clone.find('.slot-timing').addClass('slots-full');
            }
            $('#modal-hiring-team').find('.modal-body').append($clone);
       });
       $('#modal-hiring-team').find('.to-clone').hide(); 
       $('#modal-hiring-team').modal('show');  
    } 
    //rendering time-slots along with checkboxes to nominate oneself for particular slot using state.viewSlot-for PANELIST
    if($.isEmptyObject(state.nominateOnSlot)){
        
    }
    else {

        $('#myModal').find('.view-slot-date').html(state.nominateOnSlot.Date);
       state.nominateOnSlot.listOfSlots.forEach(slot => {
            let $clone = $('#myModal').find('.to-clone').clone();
            $clone.removeClass('to-clone');
            $clone.find('.slot-timing').html(slot.startTime+'-'+slot.endTime);
            $clone.find('input').attr('id',slot.slotId);
            $clone.find('label').attr('for',slot.slotId);
            if(slot.empty=='no') {
                $clone.find('.slot-full').html('(Slot Full)');
                $clone.find('.slot-timing').addClass('slots-full');
                $clone.find('input').attr('disabled', true);
            }
            $('#myModal').find('.nominate-on-slots').append($clone);
       });

       $('#myModal').find('.to-clone').hide(); 
       $('#myModal').modal('show'); 
       $('#myModal').find('.edit-btn').on('click',()=>{
        $('#modal-hiring-team').modal('hide');
            $('#myModal').modal('hide'); 
            let listOfSlots=state.nominateOnSlot.listOfSlots.map(nominationupdate);
            state.nominateOnSlot.listOfSlots=listOfSlots.slice();
            controlPanelDispatcher.dispatch(actionObj.updateSlotInformationAction(state.nominateOnSlot));
            $('#nominationUpdateModal').modal('show');
       });
       
    }      
}

const nominationupdate=(item,index)=>{
    if ($('#myModal').find('#'+item.slotId).is(':checked')) {
        item.empty="no";
        item.emailAddress="deeratho@publicisgroupe.net";
    }
    return item;
} 

$(document).ready(() => {
    init();
    controlPanelDispatcher.dispatch(actionObj.getMonthSlotsAction());
    render(calenderViewStore.getUserPreferences());
});

function init() { 
    cal.wrap.find("#prev").bind("click.calendar", function () { cal.switchMonth(false); }); 
    cal.wrap.find("#next").bind("click.calendar", function () { cal.switchMonth(true);  }); 
    cal.label.bind("click", function () { 
        cal.switchMonth(null, new Date().getMonth(), new Date().getFullYear());
    });        
    cal.label.click();
    $('.curr').find('td:not(.nil)').append('<div class="color-slots"></div>');
    $(".curr td").each((element,value)=>{
        $(value).on("click",()=>{
            if(role!="hiring"){
                
                controlPanelDispatcher.dispatch(actionObj.nominateOnSlotsAction($(value).text()));
            }
            else{
                controlPanelDispatcher.dispatch(actionObj.viewSlotsAction($(value).text()));
            }
        });
    });
}




