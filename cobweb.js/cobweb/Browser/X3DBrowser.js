
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowserContext",
	"cobweb/Configuration/SupportedNodes",
	"cobweb/Execution/Scene",
	"cobweb/InputOutput/Loader",
	"cobweb/Parser/XMLParser",
	"cobweb/Parser/Parser",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DBrowserContext,
          SupportedNodes,
          Scene,
          Loader,
          XMLParser,
          Parser,
          X3DConstants)
{
	with (Fields)
	{
		function X3DBrowser (xml)
		{
			X3DBrowserContext .call (this, xml);

			this .currentSpeed        = 0;
			this .currentFrameRate    = 0;
			this .description_        = "";
			this .supportedNodes      = SupportedNodes;
			this .supportedComponents = undefined;
			this .supportedProfiles   = undefined;
		};

		X3DBrowser .prototype = $.extend (Object .create (X3DBrowserContext .prototype),
		{
			constructor: X3DBrowser,
			initialize: function ()
			{
				X3DBrowserContext .prototype .initialize .call (this);

				// Create an empty scene if any thing goes wrong in loadURL.
				var scene = this .createScene ();

				this .replaceWorld (scene);

				var urlCharacters = this .getXML () [0] .getAttribute ("url");

				if (urlCharacters)
				{
				   var
				      parser = new Parser (scene, "", true),
				      url = new MFString ();

					parser .setInput (urlCharacters);
					parser .mfstringValues (url);

					if (url .length)
						this .loadURL (url);
				}
			},
			getName: function ()
			{
				return this .name;
			},
			getVersion: function ()
			{
				return this .version;
			},
			getCurrentSpeed: function ()
			{
				return this .currentSpeed;
			},
			getCurrentFrameRate: function ()
			{
				return this .currentFrameRate;
			},
			setDescription: function (value)
			{
				this .description = value;
			},
			getWorldURL: function ()
			{
				return this .currentScene .worldURL;
			},
			createScene: function ()
			{
			   var scene = new Scene (this);

				scene .setup ();

				if (this .isExternal ())
				   return scene;

				scene .beginUpdate ();

				return scene;
			},
			replaceWorld: function (scene)
			{
				// Remove world.

				if (this .getWorld ())
				{
					this .isLive () .removeFieldInterest (this .getExecutionContext () .isLive ());
					this .getExecutionContext () .endUpdate ();
					this .shutdown () .processInterests ();
				}
					
				// Replace world.

				this .getCanvas () .stop (true, true) .fadeOut (0);
				this .description = "";

				if (! scene)
					scene = this .createScene ();
				
				// bindWorld

				var id = performance .now ();

				this .resetLoadCount ();
				this .loadCount_ .addFieldCallback ("bindWorld" + id, this .bindWorld .bind (this, id));

				// isLive

				this .isLive () .addFieldInterest (scene .isLive ());

				if (this .isLive () .getValue ())
					scene .beginUpdate ();
				else
					scene .endUpdate ();

				//
	
				this .setExecutionContext (scene);

				this .initialized () .setValue (this .getCurrentTime ());
			},
			bindWorld: function (id, value)
			{
				if (value)
					return;

				this .loadCount_ .removeFieldCallback ("bindWorld" + id);

				setTimeout (function ()
				{
					this .getWorld () .bind ();
					this .getCanvas () .fadeIn (2000);
				}
				.bind (this), 0);
			},
			createVrmlFromString: function (vrmlSyntax)
			{
			   var rootNodes = new MFNode ();

				rootNodes .setValue (this .createX3DFromString (vrmlSyntax) .rootNodes);

				return rootNodes;
			},
			createX3DFromString: function (x3dSyntax)
			{
				var
					currentScene = this .currentScene,
					external     = this .isExternal (),
					scene        = new Loader (this .getWorld ()) .createX3DFromString (this .currentScene .getWorldURL (), x3dSyntax);

				if (! external)
				{
					currentScene .isLive () .addFieldInterest (scene .isLive ());

					if (currentScene .isLive () .getValue ())
						scene .beginUpdate ();
				}

				scene .setup ();

				return scene;
			},
			createVrmlFromURL: function (url, node, event)
			{
				if (! (node instanceof SFNode))
					throw Error ("Browser.createVrmlFromURL: node must be of type SFNode.");

				if (! node .getValue ())
					throw Error ("Browser.createVrmlFromURL: node IS NULL.");

				var field = node .getValue () .getField (event);

				if (field .getType () !== X3DConstants .MFNode)
					throw Error ("Browser.createVrmlFromURL: event named '" + event + "' must be of type MFNode.");

				var
					currentScene = this .currentScene,
					external     = this .isExternal ();

				new Loader (this .getWorld ()) .createX3DFromURL (url,
				function (scene)
				{
					if (scene)
					{
						// Handle isLive for script scenes here:

					   if (! external)
					   {
					      currentScene .isLive () .addFieldInterest (scene .isLive ());

							if (currentScene .isLive () .getValue ())
							   scene .beginUpdate ();
						}

						scene .setup ();
					   
						// Wait until scene is completely loaded, scene .loadCount_ must be 0.
						field .setValue (scene .rootNodes);
					}
				});
			},
			createX3DFromURL: function (url, event, node)
			{
				if (arguments .length === 3)
				{
					//createX3DFromURL(MFString, String, Object)
					//??? what is String and what is Object ???
					return null;
				}

				var
					currentScene = this .currentScene,
					external     = this .isExternal (),
					scene        = new Loader (this .getWorld ()) .createX3DFromURL (url);

				if (! external)
				{
					currentScene .isLive () .addFieldInterest (scene .isLive ());
							
					if (currentScene .isLive () .getValue ())
						scene .beginUpdate ();
				}

				scene .setup ();

				return scene;
			},
			loadURL: function (url, parameter)
			{
				var id = this .addLoadCount ();

				new Loader (this .getWorld ()) .createX3DFromURL (url,
				function (scene)
				{
					if (scene)
						this .replaceWorld (scene);

					this .removeLoadCount (id);
				}
				.bind (this),
				function (fragment)
				{
				   try
				   {
						this .currentScene .changeViewpoint (fragment);
					}
					catch (error)
					{ }

					this .removeLoadCount (id);
				}
				.bind (this));
			},
			getRenderingProperty: function (name)
			{
				this .getRenderingProperties () .getField (name) .getValue ();
			},
			addBrowserListener: function (callback, object)
			{
			},
			removeBrowserListener: function (callback)
			{	
			},
			importDocument: function (dom)
			{
				if (! dom) return;
				
				new XMLParser (this .currentScene, dom) .parseIntoScene ();

				this .currentScene .setup ();
			},
			setBrowserOption: function (name, value)
			{
				this .getBrowserOptions () .getField (name) .setValue (value);
			},
			getBrowserOption: function (name)
			{
				return this .getBrowserOptions () .getField (name) .getValue ();
			},
			firstViewpoint: function ()
			{
				var activeLayer = this .getActiveLayer ();
			
				if (activeLayer)
				{
					var viewpoints = activeLayer .getUserViewpoints ();

					if (viewpoints .length)
						this .bindViewpoint (viewpoints [0]);
				}
			},
			previousViewpoint: function ()
			{
				var activeLayer = this .getActiveLayer ();

				if (activeLayer)
				{
					var viewpoints = activeLayer .getUserViewpoints ();

					if (viewpoints .length === 0)
						return;

					var index = 0;

					for (var i = 0; i < viewpoints .length; ++ i)
					{
						if (viewpoints [i] .isBound_ .getValue ())
							break;

						++ index;
					}

					if (index < viewpoints .length)
					{
						if (index === 0)
							this .bindViewpoint (viewpoints [viewpoints .length - 1]);

						else
							this .bindViewpoint (viewpoints [index - 1]);
					}
					else
						this .bindViewpoint (viewpoints [viewpoints .length - 1]);
				}
			},
			nextViewpoint: function ()
			{
				var activeLayer = this .getActiveLayer ();

				if (activeLayer)
				{
					var viewpoints = activeLayer .getUserViewpoints ();

					if (viewpoints .length === 0)
						return;

					var index = 0;

					for (var i = 0; i < viewpoints .length; ++ i)
					{
						if (viewpoints [i] .isBound_ .getValue ())
							break;

						++ index;
					}

					if (index < viewpoints .length)
					{
						if (index === viewpoints .length - 1)
							this .bindViewpoint (viewpoints [0]);

						else
							this .bindViewpoint (viewpoints [index + 1]);
					}
					else
						this .bindViewpoint (viewpoints [0]);
				}
			},
			lastViewpoint: function ()
			{
				var activeLayer = this .getActiveLayer ();

				if (activeLayer)
				{
					var viewpoints = activeLayer .getUserViewpoints ();

					if (viewpoints .length)
						this .bindViewpoint (viewpoints [viewpoints .length - 1]);
				}
			},
			changeViewpoint: function (name)
			{
				try
				{
					this .currentScene .changeViewpoint (name);
				}
				catch (error)
				{
					console .log (error .message);
				}
			},
			bindViewpoint: function (viewpoint)
			{
				if (viewpoint .isBound_ .getValue ())
					viewpoint .transitionStart (null, viewpoint);

				else
					viewpoint .set_bind_ = true;
			},
			addRoute: function (fromNode, fromEventOut, toNode, toEventIn)
			{
				this .currentScene .addRoute (fromNode, fromEventOut, toNode, toEventIn);
			},
			deleteRoute: function (fromNode, fromEventOut, toNode, toEventIn)
			{
				try
				{
					this .currentScene .deleteRoute (this .currentScene .getRoute (fromNode, fromEventOut, toNode, toEventIn));
				}
				catch (error)
				{
					console .log (error);
				}
			},
			print: function ()
			{
				var string = "";

				for (var i = 0; i < arguments .length; ++ i)
					string += arguments [i];

				console .log (string);
			},
			println: function ()
			{
				var string = "";

				for (var i = 0; i < arguments .length; ++ i)
					string += arguments [i];

				//string += "\n";

				console .log (string);
			},
		});

		Object .defineProperty (X3DBrowser .prototype, "name",
		{
			get: function () { return "Cobweb X3D Browser"; },
			enumerable: true,
			configurable: false
		});

		Object .defineProperty (X3DBrowser .prototype, "version",
		{
			get: function () { return "1.15"; },
			enumerable: true,
			configurable: false
		});

		Object .defineProperty (X3DBrowser .prototype, "description",
		{
			get: function () { return this .description_; },
			set: function (value)
			{
				this .description_                = value;
				this .getNotification () .string_ = value;
			},
			enumerable: true,
			configurable: false
		});

		Object .defineProperty (X3DBrowser .prototype, "currentScene",
		{
			get: function ()
			{
				return this .getScriptStack () [this .getScriptStack () .length - 1] .getExecutionContext ();
			},
			enumerable: true,
			configurable: false
		});

		return X3DBrowser;
	}
});
