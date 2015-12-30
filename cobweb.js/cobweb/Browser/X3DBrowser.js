
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowserContext",
	"cobweb/Browser/Version",
	"cobweb/Configuration/ComponentInfo",
	"cobweb/Configuration/SupportedProfiles",
	"cobweb/Configuration/SupportedComponents",
	"cobweb/Configuration/SupportedNodes",
	"cobweb/Execution/Scene",
	"cobweb/InputOutput/Loader",
	"cobweb/Parser/XMLParser",
	"cobweb/Parser/Parser",
	"cobweb/Bits/X3DConstants",
	"lib/gettext",
],
function ($,
          Fields,
          X3DBrowserContext,
          Version,
          ComponentInfo,
          SupportedProfiles,
          SupportedComponents,
          SupportedNodes,
          Scene,
          Loader,
          XMLParser,
          Parser,
          X3DConstants,
          _)
{
"use strict";

	function X3DBrowser (element)
	{
		X3DBrowserContext .call (this, element);

		this .currentSpeed         = 0;
		this .currentFrameRate     = 0;
		this .description_         = "";
		this .supportedNodes       = SupportedNodes;
		this .supportedComponents  = SupportedComponents;
		this .supportedProfiles    = SupportedProfiles;
	};

	X3DBrowser .prototype = $.extend (Object .create (X3DBrowserContext .prototype),
	{
		constructor: X3DBrowser,
		initialize: function ()
		{
			// Create an empty scene if any thing goes wrong in loadURL.
			var scene = this .createScene ();

			this .replaceWorld (this .createScene ());

			X3DBrowserContext .prototype .initialize .call (this);

			this .getLoadSensor () .loadTime_ .addInterest (this, "realize");

			this .print ("Welcome to " + this .name + " X3D Browser " + this .version + ":\n" +
			                "        Current Graphics Renderer\n" +
			                "                Name: " + this .getVendor () + " " + this .getWebGLVersion () + "\n" +
			                "                Shading language: " + this .getShadingLanguageVersion () + "\n" +
			                "        Rendering Properties\n" +
			                "                Texture units: " + this .getMaxTextureUnits () + " / " + this .getMaxCombinedTextureUnits () + "\n" +
			                "                Max texture size: " + this .getMaxTextureSize () + " × " + this .getMaxTextureSize () + " pixel\n" +
			                "                Max lights: 0\n" +
			                "                Max vertex uniform vectors: " + this .getMaxVertexUniformVectors () + "\n" +
			                "                Max fragment uniform vectors: " + this .getMaxFragmentUniformVectors () + "\n" +
			                "                Max vertex attribs: " + this .getMaxVertexAttribs () + "\n" +
			                "                Antialiased: " + this .getAntialiased () + "\n" +
			                "                Color depth: " + this .getColorDepth () + " bits\n");
		},
		realize: function ()
		{
			this .getLoadSensor () .loadTime_ .removeInterest (this, "realize");

			var urlCharacters = this .getElement () [0] .getAttribute ("url");

			if (urlCharacters)
			{
			   var
			      parser    = new Parser (this .getExecutionContext (), "", true),
			      url       = new Fields .MFString (),
					parameter = new Fields .MFString ();

				parser .setInput (urlCharacters);
				parser .sfstringValues (url);

				if (url .length)
					this .loadURL (url, parameter);
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
		getProfile: function (name)
		{
			var profile = this .supportedProfiles .get (name);

			if (profile)
				return profile;

			throw Error ("Profile '" + name + "' is not supported.");
		},
		getComponent: function (name, level)
		{
			var component = this .supportedComponents .get (name);

			if (component)
			{
				if (level <= component .level)
					return new ComponentInfo (name, level, component .title, this .browser .getProviderUrl ());
			}

			throw Error ("Component '" + name + "' at level '" + level + "' is not supported.");
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
				this .getExecutionContext () .endUpdate ();
				this .shutdown () .processInterests ();
			}
				
			// Replace world.


			if (! scene)
				scene = this .createScene ();
			
			// bindWorld
			this .loadCount_ .removeFieldCallback ("bindWorld" + this .loadId);
			this .loadId      = performance .now ();
			this .description = "";
			this .setBrowserLoading (true);
			this .loadCount_ .addFieldCallback ("bindWorld" + this .loadId, this .bindWorld .bind (this));

			if (this .isLive () .getValue ())
				scene .beginUpdate ();
			else
				scene .endUpdate ();

			this .setExecutionContext (scene);

			this .initialized () .setValue (this .getCurrentTime ());
		},
		bindWorld: function (value)
		{
			if (value)
				return;

			this .loadCount_ .removeFieldCallback ("bindWorld" + this .loadId);

			this .getWorld () .bind ();
			this .setBrowserLoading (false);
		},
		createVrmlFromString: function (vrmlSyntax)
		{
		   var rootNodes = new Fields .MFNode ();

			rootNodes .setValue (this .createX3DFromString (vrmlSyntax) .rootNodes);

			return rootNodes;
		},
		createX3DFromString: function (x3dSyntax)
		{
			var
				currentScene = this .currentScene,
				external     = this .isExternal (),
				scene        = new Loader (this .getWorld ()) .createX3DFromString (this .currentScene .getURL (), x3dSyntax);

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
			if (! (node instanceof Fields .SFNode))
				throw new Error ("Browser.createVrmlFromURL: node must be of type SFNode.");

			if (! node .getValue ())
				throw new Error ("Browser.createVrmlFromURL: node IS NULL.");

			var field = node .getValue () .getField (event);

			if (! field .isInput ())
				throw new Error ("Browser.createVrmlFromURL: event named '" + event + "' must be a input field.");

			if (field .getType () !== X3DConstants .MFNode)
				throw new Error ("Browser.createVrmlFromURL: event named '" + event + "' must be of type MFNode.");

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
				return this .createVrmlFromURL (url, event, node);

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
			var target;

			for (var i = 0, length = parameter .length; i < length; ++ i)
			{
				var pair = parameter [i] .split ("=");

				if (pair .length !== 2)
					continue;

				if (pair [0] === "target")
					target = pair [1];
			}

			this .setBrowserLoading (true);

			var id = this .addLoadCount ();

			new Loader (this .getWorld ()) .createX3DFromURL (url,
			function (scene)
			{
				if (scene)
					this .replaceWorld (scene);
				else
					setTimeout (function () { this .getLoadingElement () .find (".cobweb-spinner-text") .text (_ ("Failed loading world.")); } .bind (this), 31);

				this .removeLoadCount (id);
				// Don't set browser loading to false.
			}
			.bind (this),
			function (fragment)
			{
				this .currentScene .changeViewpoint (fragment);
				this .removeLoadCount (id);
				this .setBrowserLoading (false);
			}
			.bind (this),
			function (url)
			{
				if (target)
					window .open (url, target);
				else
					location = url;

				this .removeLoadCount (id);
				this .setBrowserLoading (false);
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
		beginUpdate: function ()
		{
			X3DBrowserContext .prototype .beginUpdate .call (this);
			this .getExecutionContext () .beginUpdate ();
		},
		endUpdate: function ()
		{
			X3DBrowserContext .prototype .endUpdate .call (this);
			// DEBUG
			//this .getExecutionContext () .endUpdate ();
		},
		print: function ()
		{
			var string = "";

			for (var i = 0; i < arguments .length; ++ i)
				string += arguments [i];

			console .log (string);

			$(".cobweb-console") .append (string);
		},
		println: function ()
		{
			var string = "";

			for (var i = 0; i < arguments .length; ++ i)
				string += arguments [i];

			console .log (string);

			string += "\n";

			$(".cobweb-console") .append (string);
		},
	});

	Object .defineProperty (X3DBrowser .prototype, "name",
	{
		get: function () { return "Cobweb"; },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DBrowser .prototype, "version",
	{
		get: function () { return Version; },
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
});
