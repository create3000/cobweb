
define ([
	"cobweb/Fields",
	"cobweb/Browser/Navigation/ExamineViewer",
	"cobweb/Browser/Navigation/WalkViewer",
	"cobweb/Browser/Navigation/FlyViewer",
	"cobweb/Browser/Navigation/NoneViewer",
	"cobweb/Components/Lighting/DirectionalLight",
],
function (Fields,
          ExamineViewer,
          WalkViewer,
          FlyViewer,
          NoneViewer,
          DirectionalLight)
{
	with (Fields)
	{
		var noneViewer = new MFString ("NONE");

		function X3DNavigationContext ()
		{
			this .addChildren ("availableViewers", new MFString (),
			                   "viewer",           new SFString ("EXAMINE"));
		}

		X3DNavigationContext .prototype =
		{
			initialize: function ()
			{
			   this .initialized () .addInterest (this, "set_world__");
			   this .shutdown () .addInterest (this, "remove_world__");
			   this .viewer_ .addInterest (this, "set_viewer__");

				this .activeLayerNode    = null;
				this .navigationInfoNode = null;
				this .viewer             = null;
				
				var headlight = new DirectionalLight (this);
				headlight .setup ();
				this .headlight = headlight .getContainer ();
			},
			getHeadlight: function ()
			{
				return this .headlight;
			},
			getActiveLayer: function ()
			{
			   return this .activeLayerNode;
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
			      this .navigationInfoNode .type_ .removeInterest (this, "set_viewerType__");

			   if (! this .activeLayerNode)
			   {
			      this .navigationInfoNode = null;

					this .set_viewerType__ (noneViewer);
					return;
				}

				this .navigationInfoNode = this .activeLayerNode .getNavigationInfo ();

			   this .navigationInfoNode .type_ .addInterest (this, "set_viewerType__");

			   this .set_viewerType__ (this .navigationInfoNode .type_);
			},
			set_viewerType__: function (type)
			{
				this .availableViewers_ .length = 0;;

				var
					examineViewer = false,
					walkViewer    = false,
					flyViewer     = false,
					planeViewer   = false,
					noneViewer    = false,
					lookAt        = false;

				// Determine active viewer.

				this .viewer_ = "EXAMINE";

				for (var i = 0; i < type .length; ++ i)
				{
				   var string = type [i];

					switch (string)
					{
						case "LOOKAT":
							// Continue with next type.
							continue;
						case "EXAMINE":
						case "WALK":
						case "FLY":
						case "NONE":
							this .viewer_ = string;
							break;
						case "PLANE_create3000.de":
							this .viewer_ = "PLANE";
							break;
						default:
							continue;
					}

					// Leave for loop.
					break;
				}

				// Determine available viewers.

				if (! type .length)
				{
					examineViewer = true;
					walkViewer    = true;
					flyViewer     = true;
					planeViewer   = true;
					noneViewer    = true;
					lookAt        = true;
				}
				else
				{
					for (var i = 0; i < type .length; ++ i)
					{
					   var string = type [i];

						switch (string)
						{
							case "EXAMINE":
								examineViewer = true;
								continue;
							case "WALK":
								walkViewer = true;
								continue;
							case "FLY":
								flyViewer = true;
								continue;
							case "PLANE":
								planeViewer = true;
								continue;
							case "NONE":
								noneViewer = true;
								continue;
							case "LOOKAT":
								lookAt = true;
								continue;
						}

						if (string == "ANY")
						{
							examineViewer = true;
							walkViewer    = true;
							flyViewer     = true;
							planeViewer   = true;
							noneViewer    = true;
							lookAt        = true;

							// Leave for loop.
							break;
						}

						// Some string defaults to EXAMINE.
						examineViewer = true;
					}

					if (examineViewer)
						this .availableViewers_ .push ("EXAMINE");

					if (walkViewer)
						this .availableViewers_ .push ("WALK");

					if (flyViewer)
						this .availableViewers_ .push ("FLY");

					if (planeViewer)
						this .availableViewers_ .push ("PLANE");

					if (noneViewer)
						this .availableViewers_ .push ("NONE");

					if (lookAt)
					{
						if (! this .availableViewers_ .length)
						{
							this .viewer_ = "NONE";
							this .availableViewers_ .push ("NONE");
						}

						this .availableViewers_ .push ("LOOKAT");
					}
				}
			},
			set_viewer__: function ()
			{
			   if (this .viewer)
			      this .viewer .dispose ();

				switch (this .viewer_ .getValue ())
				{
					case "EXAMINE":
					   this .viewer = new ExamineViewer (this);
						break;
					case "WALK":
					   this .viewer = new WalkViewer (this);
						break;
					case "FLY":
					   this .viewer = new FlyViewer (this);
						break;
					case "PLANE":
					   this .viewer = new NoneViewer (this);
						break;
					case "NONE":
					   this .viewer = new NoneViewer (this);
						break;
					default:
					   this .viewer = new ExamineViewer (this);
						break;
				}

				this .viewer .setup ();
			},
		};

		return X3DNavigationContext;
	}
});
