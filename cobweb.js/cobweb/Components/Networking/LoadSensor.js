
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Networking/X3DNetworkSensorNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNetworkSensorNode,
          X3DCast,
          X3DConstants)
{
"use strict";

	function LoadSensor (executionContext)
	{
		X3DNetworkSensorNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .LoadSensor);

		this .urlObjects = [ ];
		this .aborted    = false;
		this .timeOutId  = undefined;
	}

	LoadSensor .prototype = $.extend (Object .create (X3DNetworkSensorNode .prototype),
	{
		constructor: LoadSensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "enabled",   new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput, "timeOut",   new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isActive",  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "isLoaded",  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "progress",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,  "loadTime",  new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "watchList", new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "LoadSensor";
		},
		getComponentName: function ()
		{
			return "Networking";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DNetworkSensorNode .prototype .initialize .call (this);

			this .enabled_   .addInterest (this,"set_enabled__");
			this .timeOut_   .addInterest (this,"set_timeOut__");
			this .watchList_ .addInterest (this,"set_watchList__");

			this .watchList_ .addEvent ();
		},
		set_enabled__: function ()
		{
			if (this .enabled_ .getValue ())
				this .reset ();
		
			else
			{
				this .abort ();
				this .remove ();
			}
		},
		set_timeOut__: function ()
		{
			if (this .isActive_ .getValue ())
			{
				this .clearTimeout ();

				this .aborted = false;

				if (this .timeOut_ .getValue () > 0)
					this .timeOutId = setTimeout (this .abort .bind (this), this .timeOut_ .getValue () * 1000);
			}
		},
		set_watchList__: function ()
		{
			this .reset ();
		},
		set_loadState__: function (dummy, urlObject)
		{
			switch (urlObject .checkLoadState ())
			{
				case X3DConstants .NOT_STARTED_STATE:
					break;
				case X3DConstants .IN_PROGRESS_STATE:
				case X3DConstants .COMPLETE_STATE:
				case X3DConstants .FAILED_STATE:
				{
					this .count ();
					break;
				}
			}
		},
		count: function ()
		{
			var
				complete   = 0,
				failed     = 0,
				urlObjects = this .urlObjects;

			for (var i = 0, length = urlObjects .length; i < length; ++ i)
			{
				var urlObject = urlObjects [i];

				complete += urlObject .checkLoadState () == X3DConstants .COMPLETE_STATE;
				failed   += urlObject .checkLoadState () == X3DConstants .FAILED_STATE;
			}

			var progress = complete / urlObjects .length;

			if (this .aborted || failed || complete == urlObjects .length)
			{
				var loaded = complete == urlObjects .length;

				this .clearTimeout ();

				this .isActive_ = false;
				this .isLoaded_ = loaded;
				this .progress_ = progress;

				if (loaded)
					this .loadTime_ = this .getBrowser () .getCurrentTime ();
			}
			else
			{
				if (this .isActive_ .getValue ())
				{
					this .progress_ = progress;
				}
				else
				{
					this .isActive_ = true;

					this .progress_ = progress;
		
					this .set_timeOut__ ();
				}
			}
		},
		abort: function ()
		{
			this .clearTimeout ();

			this .aborted = true;

			if (this .enabled_ .getValue ())
				this .count ();
		},
		reset: function ()
		{
			this .remove ();
		
			if (this .enabled_ .getValue ())
			{
				var
					watchList  = this .watchList_ .getValue (),
					urlObjects = this .urlObjects;

				for (var i = 0, length = watchList .length; i < length; ++ i)
				{
					var urlObject = X3DCast (X3DConstants .X3DUrlObject, watchList [i]);
		
					if (urlObject)
					{
						urlObjects .push (urlObject);
		
						urlObject .loadState_ .addInterest (this, "set_loadState__", urlObject);
					}
				}

				this .count ();
			}
		},
		remove: function ()
		{
			this .clearTimeout ();

			var urlObjects = this .urlObjects;

			for (var i = 0, length = urlObjects .length; i < length; ++ i)
				urlObjects [i] .loadState_ .removeInterest (this, "set_loadState__");

			urlObjects .length = 0;
		},
		clearTimeout: function ()
		{
			clearTimeout (this .timeOutId);
			this .timeOutId = undefined;
		},
	});

	return LoadSensor;
});


