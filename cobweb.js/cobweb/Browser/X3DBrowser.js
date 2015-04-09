
define ([
	"jquery",
	"cobweb/Browser/X3DBrowserContext",
	"cobweb/Configuration/SupportedNodes",
	"cobweb/Execution/Scene",
	"cobweb/InputOutput/Loader",
	"cobweb/Parser/XMLParser",
],
function ($, X3DBrowserContext, SupportedNodes, Scene, Loader, XMLParser)
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

	X3DBrowser .prototype = $.extend (new X3DBrowserContext (),
	{
		constructor: X3DBrowser,
		initialize: function ()
		{
			X3DBrowserContext .prototype .initialize .call (this);

			this .replaceWorld (this .createScene ());
			this .traverse ();
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
			return new Scene (this);
		},
		replaceWorld: function (scene)
		{
			// Remove world.
			
			if (this .getWorld ())
			{
				this .isLive_ .removeFieldInterest (this .getExecutionContext () .isLive_);
				this .getExecutionContext () .isLive_ = false;
			}

			// Replace world.

			this .getCanvas () .stop (true, true) .fadeOut (0);
			this .description = "";

			if (! scene)
				scene = this .createScene ();

			scene .setup ();
			this .setExecutionContext (scene);

			this .isLive_ .addFieldInterest (scene .isLive_);
			scene .isLive_ = this .isLive_;

			this .loadCount_ .addFieldCallback ("loading", this .bindWorld .bind (this));
			this .loadCount_ .addEvent ();
		},
		bindWorld: function (value)
		{
			if (value)
				return;

			this .loadCount_ .removeFieldCallback ("loading");

			setTimeout (function ()
			{
				this .getWorld () .bind ();
				this .getCanvas () .fadeIn (2000);
			}
			.bind (this), 0);
		},
		createX3DFromString: function (x3dSyntax)
		{
			var scene = new Loader (this .getWorld ()) .createX3DFromString (this .currentScene .getWorldURL (), x3dSyntax);

			scene .setup ();

			return scene;
		},
		createX3DFromURL: function (url, field, node)
		{
			var scene = new Loader (this .getWorld ()) .createX3DFromURL (url);

			scene .setup ();

			return scene;
		},
		loadURL: function (url, parameter)
		{
			this .addLoadCount ();

			new Loader (this .getWorld ()) .createX3DFromURL (url, function (scene)
			{
				this .replaceWorld (scene);
				this .removeLoadCount ();
			}
			.bind (this));
		},
		getRenderingProperty: function (name)
		{
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
			try
			{
				this .getBrowserOptions () .getField (name) .setValue (value);
			}
			catch (error)
			{ }
		},
		getBrowserOption: function (name)
		{
			try
			{
				return this .getBrowserOptions () .getField (name) .getValue ();
			}
			catch (error)
			{ }
		},
		firstViewpoint: function ()
		{
			var activeLayer = this .getWorld () .getActiveLayer () .getValue ();
		
			if (activeLayer)
			{
				var viewpoints = activeLayer .getUserViewpoints ();

				if (viewpoints .length)
					this .bindViewpoint (viewpoints [0]);
			}
		},
		previousViewpoint: function ()
		{
			var activeLayer = this .getWorld () .getActiveLayer () .getValue ();

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
			var activeLayer = this .getWorld () .getActiveLayer () .getValue ();

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
			var activeLayer = this .getWorld () .getActiveLayer () .getValue ();

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

			this .getNotification () .string_ = viewpoint .description_;
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
		get: function () { return "Cobweb"; },
		enumerable: true,
		configurable: false
	});

	Object .defineProperty (X3DBrowser .prototype, "version",
	{
		get: function () { return "0.1"; },
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
