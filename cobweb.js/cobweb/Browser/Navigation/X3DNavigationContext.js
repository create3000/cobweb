
define ([
	"cobweb/Fields",
	"cobweb/Browser/Navigation/ExamineViewer",
	"cobweb/Browser/Navigation/WalkViewer",
	"cobweb/Browser/Navigation/FlyViewer",
	"cobweb/Browser/Navigation/PlaneViewer",
	"cobweb/Browser/Navigation/NoneViewer",
	"cobweb/Components/Lighting/DirectionalLight",
],
function (Fields,
          ExamineViewer,
          WalkViewer,
          FlyViewer,
          PlaneViewer,
          NoneViewer,
          DirectionalLight)
{
	with (Fields)
	{
		var NONE = new SFString ("NONE");

		getHeadLight = function (executionContext)
		{
			var light = new DirectionalLight (executionContext);
			light .setup ();
			var headlight = light .getLights () .pop (light);
			headlight .pop = function () { };
			return headlight;
		};

		function X3DNavigationContext ()
		{
			this .addChildren ("availableViewers", new MFString (),
			                   "viewer",           new SFString ("EXAMINE"));
			
			this .collisions         = [ ];
			this .activeCollisions   = { };
			this .collisionCount     = 0;
			this .activeLayerNode    = null;
			this .navigationInfoNode = null;
			this .viewerNode         = null;
		}

		X3DNavigationContext .prototype =
		{
			initialize: function ()
			{
				this .viewer_ .addInterest (this, "set_viewer__");

				this .initialized () .addInterest (this, "set_world__");
				this .shutdown ()    .addInterest (this, "remove_world__");

				this .headlight = getHeadLight (this);
			},
			getHeadlight: function ()
			{
				return this .headlight;
			},
			getActiveLayer: function ()
			{
				return this .activeLayerNode;
			},
			getCollisions: function ()
			{
				return this .collisions;
			},
			addCollision: function (object)
			{
				if (this .activeCollisions .hasOwnProperty (object .getId ()))
					return;

				this .activeCollisions [object .getId ()] = true;

				++ this .collisionCount;
			},
			removeCollision: function (object)
			{
				if (! this .activeCollisions .hasOwnProperty (object .getId ()))
					return;

				delete this .activeCollisions [object .getId ()];

				-- this .collisionCount;
			},
			getCollisionCount: function ()
			{
				return this .collisionCount;
			},
			remove_world__: function ()
			{
				this .getWorld () .activeLayer_ .removeInterest (this, "set_activeLayer__");
			},
			set_world__: function ()
			{
				this .getWorld () .activeLayer_ .addInterest (this, "set_activeLayer__");

				this .set_activeLayer__ ();
			},
			set_activeLayer__: function ()
			{
				if (this .activeLayerNode)
					this .activeLayerNode .getNavigationInfoStack () .removeInterest (this, "set_navigationInfo__");

				this .activeLayerNode = this .getWorld () .getActiveLayer ();

				if (this .activeLayerNode)
					this .activeLayerNode .getNavigationInfoStack () .addInterest (this, "set_navigationInfo__");

				this .set_navigationInfo__ ();
			},
			set_navigationInfo__: function ()
			{
				if (this .navigationInfoNode)
					this .navigationInfoNode .viewer_ .removeFieldInterest (this .viewer_);

				if (! this .activeLayerNode)
				{
					this .navigationInfoNode = null;

					this .viewer_ = "NONE";
					return;
				}

				this .navigationInfoNode = this .activeLayerNode .getNavigationInfo ();

				this .navigationInfoNode .viewer_ .addFieldInterest (this .viewer_);

				this .viewer_ = this .navigationInfoNode .viewer_;
			},
			set_viewer__: function (viewer)
			{
				if (this .navigationInfoNode)
					this .availableViewers_ = this .navigationInfoNode .availableViewers_;
				else
					this .availableViewers_ .length = 0;

				// Create viewer node.

				if (this .viewerNode)
					this .viewerNode .dispose ();

				switch (viewer .getValue ())
				{
					case "EXAMINE":
						this .viewerNode = new ExamineViewer (this);
						break;
					case "WALK":
						this .viewerNode = new WalkViewer (this);
						break;
					case "FLY":
						this .viewerNode = new FlyViewer (this);
						break;
					case "PLANE":
					case "PLANE_create3000.de":
						this .viewerNode = new PlaneViewer (this);
						break;
					case "NONE":
						this .viewerNode = new NoneViewer (this);
						break;
					default:
						this .viewerNode = new ExamineViewer (this);
						break;
				}

				this .viewerNode .setup ();
			},
		};

		return X3DNavigationContext;
	}
});
