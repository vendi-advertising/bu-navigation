if("undefined"===typeof bu||"undefined"===typeof bu.plugins.navigation||"undefined"===typeof bu.plugins.navigation.tree)throw new TypeError("BU Navigation Manager script dependencies have not been met!");
(function(b){bu.plugins.navigation.views=bu.plugins.navigation.views||{};var g,f,c;g=bu.plugins.navigation.views.Navman={el:"#nav-tree-container",ui:{form:"#navman_form",noticesContainer:"#navman-notices",movesField:"#navman-moves",insertsField:"#navman-inserts",updatesField:"#navman-updates",deletionsField:"#navman-deletions",expandAllBtn:"#navman_expand_all",collapseAllBtn:"#navman_collapse_all",saveBtn:"#bu_navman_save"},data:{dirty:!1,deletions:[],insertions:{},updates:{},moves:{}},initialize:function(){var a=
this.settings=bu_navman_settings;a.el=this.el;c=bu.plugins.navigation.tree("navman",a);f.initialize({allowTop:!!a.allowTop,isSectionEditor:!!a.isSectionEditor});c.listenFor("editPost",b.proxy(this.editPost,this));c.listenFor("postRemoved",b.proxy(this.postRemoved,this));c.listenFor("postMoved",b.proxy(this.postMoved,this));f.listenFor("linkInserted",b.proxy(this.linkInserted,this));f.listenFor("linkUpdated",b.proxy(this.linkUpdated,this));b(this.ui.form).bind("submit",b.proxy(this.save,this));b(this.ui.expandAllBtn).bind("click",
this.expandAll);b(this.ui.collapseAllBtn).bind("click",this.collapseAll)},expandAll:function(a){a.preventDefault();a.stopImmediatePropagation();c.showAll()},collapseAll:function(a){a.preventDefault();a.stopImmediatePropagation();c.hideAll()},editPost:function(a){"link"===a.post_type?f.edit(a):window.location="post.php?action=edit&post="+a.ID},linkInserted:function(a){this.data.insertions[a.ID]=a;this.data.dirty=!0},linkUpdated:function(a){"new"===a.post_status?this.data.insertions[a.ID]=a:this.data.updates[a.ID]=
a;this.data.dirty=!0},postRemoved:function(a){if(a=a.ID)"undefined"!==typeof this.data.insertions[a]?delete this.data.insertions[a]:("undefined"!==typeof this.data.updates[a]?delete this.data.updates[a]:"undefined"!==typeof this.data.moves[a]&&delete this.data.moves[a],this.data.deletions.push(a),this.data.dirty=!0)},postMoved:function(a){"new"!==a.post_status&&(this.data.moves[a.ID]=a,this.data.dirty=!0)},save:function(){var a=this.data.deletions,d={},h={},f={},e;b.each(this.data.insertions,function(a){(e=
c.getPost(a))&&(f[e.ID]=e)});b.each(this.data.updates,function(a){(e=c.getPost(a))&&(h[e.ID]=e)});b.each(this.data.moves,function(a){(e=c.getPost(a))&&(d[e.ID]={ID:e.ID,post_status:e.post_status,post_type:e.post_type,post_parent:e.post_parent,menu_order:e.menu_order})});b(this.ui.deletionsField).attr("value",JSON.stringify(a));b(this.ui.insertsField).attr("value",JSON.stringify(f));b(this.ui.updatesField).attr("value",JSON.stringify(h));b(this.ui.movesField).attr("value",JSON.stringify(d));a=b("<span>Saving navigation changes...</span>");
b(this.ui.saveBtn).prev("img").css("visibility","visible");this.notice(a.html(),"message");c.lock();this.data.dirty=!1},notice:function(a,c,f){var f=f||!0,g=b(this.ui.noticesContainer);f&&g.empty();g.append('<div class="'+("message"===c?"updated fade":"error")+' below-h2"><p>'+a+"</p></div>")}};f=bu.plugins.navigation.views.Linkman={el:"#navman-link-editor",ui:{form:"#navman_editlink_form",addBtn:"#navman_add_link",urlField:"#editlink_address",labelField:"#editlink_label",targetNewField:"#editlink_target_new",
targetSameField:"#editlink_target_same"},data:{currentLink:null,allowTop:!0,isSectionEditor:!1},initialize:function(a){a=a||{};b.extend(!0,this.data,a);bu.signals.register(this);this.$el=b(this.el);this.$form=b(this.ui.form);this.$el.dialog({autoOpen:!1,buttons:{Ok:b.proxy(this.save,this),Cancel:b.proxy(this.cancel,this)},minWidth:400,width:500,modal:!0,resizable:!1});b(document.body).delegate(".ui-widget-overlay, .ui-widget","click",this.stopPropagation);b(this.ui.addBtn).bind("click",b.proxy(this.add,
this));c.listenFor("postSelected",b.proxy(this.onPostSelected,this));c.listenFor("postDeselected",b.proxy(this.onPostDeselected,this));c.listenFor("postsDeselected",b.proxy(this.onPostDeselected,this))},add:function(a){a.preventDefault();a.stopPropagation();var d="";b(a.currentTarget).parent("li").hasClass("disabled")?(a=c.getSelectedPost(),d="You are not allowed to add links",a&&"link"===a.post_type?d='Links are not permitted to have children.\n\nSelect a page that you can edit and click "Add a Link" to create a new link below the selected page.':
g.settings.isSectionEditor?d='You do not have permission to create top level published content.\n\nSelect a page that you can edit and click "Add a Link" to create a new link below the selected page.':g.settings.allowTop||(d='You are not allowed to create top level published content. Select a page that you can edit and click "Add a Link" to create a new link below the selected page.\n\nSite administrators can change this behavior by visiting Site Design > Primary Navigation and enabling the "Allow Top-Level Pages" setting.'),
alert(d)):(this.data.currentLink={post_status:"new",post_type:"link",post_meta:{}},this.$el.dialog("option","title","Add a Link").dialog("open"))},edit:function(a){b(this.ui.urlField).attr("value",a.post_content);b(this.ui.labelField).attr("value",a.post_title);"new"===a.post_meta.bu_link_target?b(this.ui.targetNewField).attr("checked","checked"):b(this.ui.targetSameField).attr("checked","checked");this.data.currentLink=a;this.$el.dialog("option","title","Edit a Link").dialog("open")},save:function(a){a.preventDefault();
a.stopPropagation();if(this.$form.valid()){var a=this.data.currentLink,d;a.post_content=b(this.ui.urlField).attr("value");a.post_title=b(this.ui.labelField).attr("value");a.url=a.post_content;a.post_meta.bu_link_target=b("input[name='editlink_target']:checked").attr("value");d=c.getSelectedPost();a.post_parent=d?d.ID:0;a.menu_order=1;"new"===a.post_status&&!a.ID?(a=c.insertPost(a),this.broadcast("linkInserted",[a])):(a=c.updatePost(a),this.broadcast("linkUpdated",[a]));this.clear();this.$el.dialog("close")}},
cancel:function(a){a.preventDefault();a.stopPropagation();this.$el.dialog("close");this.clear()},clear:function(){b(this.ui.urlField).attr("value","");b(this.ui.labelField).attr("value","");b(this.ui.targetSameField).attr("checked","checked");b(this.ui.targetNewField).removeAttr("checked");this.data.currentLink=null},onPostSelected:function(a){var d=!0;"link"==a.post_type&&(d=!1);(d=bu.hooks.applyFilters("navmanCanAddLink",d,a,c))?b(this.ui.addBtn).parent("li").removeClass("disabled"):b(this.ui.addBtn).parent("li").addClass("disabled")},
onPostDeselected:function(){var a=this.data.allowTop;(a=bu.hooks.applyFilters("navmanCanAddLink",a))?b(this.ui.addBtn).parent("li").removeClass("disabled"):b(this.ui.addBtn).parent("li").addClass("disabled")},stopPropagation:function(a){a.stopPropagation()}};window.onbeforeunload=function(){if(g.data.dirty)return"You have made changes to your navigation that have not yet been saved."}})(jQuery);jQuery(document).ready(function(){bu.plugins.navigation.views.Navman.initialize()});