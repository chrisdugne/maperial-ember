
App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({
    home: Ember.Route.extend({
      route: '/',
	  connectOutlets: function(router){
	    router.get('applicationController').connectOutlet('home');
	  }
    })
  })
})





//App.Router = Ember.Router.extend({
//  enableLogging: true,
//  root: Ember.Route.extend({
//    contributors: Ember.Route.extend({
//      route: '/',
//      showContributor: Ember.Route.transitionTo('aContributor'),
//	  connectOutlets: function(router){
//		    router.get('applicationController').connectOutlet('allContributors', App.Contributor.find());
//		  }
//    }),
//    aContributor: Ember.Route.extend({
//	  route: '/:githubUserName', 
//	  showAllContributors: Ember.Route.transitionTo('contributors'),
//	  connectOutlets: function(router, context){
//	    router.get('applicationController').connectOutlet('oneContributor', context);
//	  },
//	  serialize: function(router, context){
//	    return {githubUserName: context.get('login')}
//	  }
//	})
//  })
//})