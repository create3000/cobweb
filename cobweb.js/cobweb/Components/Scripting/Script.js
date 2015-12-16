
define ([
	"jquery",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Basic/X3DField",
	"cobweb/Basic/X3DArrayField",
	"cobweb/Fields",
	"cobweb/Browser/X3DBrowser",
	"cobweb/Configuration/ComponentInfo",
	"cobweb/Configuration/ComponentInfoArray",
	"cobweb/Configuration/ProfileInfo",
	"cobweb/Configuration/ProfileInfoArray",
	"cobweb/Configuration/UnitInfo",
	"cobweb/Configuration/UnitInfoArray",
	"cobweb/Execution/X3DExecutionContext",
	"cobweb/Execution/X3DScene",
	"cobweb/Prototype/ExternProtoDeclarationArray",
	"cobweb/Prototype/ProtoDeclarationArray",
	"cobweb/Prototype/X3DExternProtoDeclaration",
	"cobweb/Prototype/X3DProtoDeclaration",
	"cobweb/Routing/RouteArray",
	"cobweb/Routing/X3DRoute",
	"cobweb/Browser/Scripting/evaluate",
	"cobweb/Components/Scripting/X3DScriptNode",
	"cobweb/InputOutput/Loader",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DField,
          X3DArrayField,
          Fields,
          X3DBrowser,
          ComponentInfo,
          ComponentInfoArray,
          ProfileInfo,
          ProfileInfoArray,
          UnitInfo,
          UnitInfoArray,
          X3DExecutionContext,
          X3DScene,
          ExternProtoDeclarationArray,
          ProtoDeclarationArray,
          X3DExternProtoDeclaration,
          X3DProtoDeclaration,
          RouteArray,
          X3DRoute,
          evaluate,
          X3DScriptNode, 
          Loader,
          X3DConstants)
{
	var fieldDefinitions = [
		new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new Fields .SFNode ()),
		new X3DFieldDefinition (X3DConstants .inputOutput,    "url",          new Fields .MFString ()),
		new X3DFieldDefinition (X3DConstants .initializeOnly, "directOutput", new Fields .SFBool ()),
		new X3DFieldDefinition (X3DConstants .initializeOnly, "mustEvaluate", new Fields .SFBool ()),
	];

	function Script (executionContext)
	{
		this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

		X3DScriptNode .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .Script);
	}

	Script .prototype = $.extend (Object .create (X3DScriptNode .prototype),
	{
		constructor: Script,
		getTypeName: function ()
		{
			return "Script";
		},
		getComponentName: function ()
		{
			return "Scripting";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DScriptNode .prototype .initialize .call (this);

			this .url_ .addInterest (this, "set_url__");

			this .requestAsyncLoad ();
		},
		getExtendedEventHandling: function ()
		{
			return false;
		},
		hasUserDefinedFields: function ()
		{
			return true;
		},
		getCDATA: function ()
		{
			return this .url_;
		},
		requestAsyncLoad: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			//this .getExecutionContext () .getScene () .addLoadCount (); // XXX: should I do this? Only addExternProtoLoadCount is available

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);

			new Loader (this) .loadScript (this .url_,
			function (data)
			{
				//this .getExecutionContext () .getScene () .removeLoadCount (); // XXX

				if (data === null)
				{
					// No URL could be loaded.
					this .setLoadState (X3DConstants .FAILED_STATE);
				}
				else
				{
					this .setLoadState (X3DConstants .COMPLETE_STATE);
					this .initialize__ (data);
				}
			}
			.bind (this));
		},
		set_url__: function ()
		{
			this .setLoadState (X3DConstants .NOT_STATED_STATE);

			this .requestAsyncLoad ();
		},
		getContext: function (text)
		{
			var
				callbacks         = ["initialize", "prepareEvents", "eventsProcessed", "shutdown"],
				userDefinedFields = this .getUserDefinedFields ();

			for (var name in userDefinedFields)
			{
				var field = userDefinedFields [name];

				switch (field .getAccessType ())
				{
					case X3DConstants .inputOnly:
						callbacks .push (field .getName ());
						break;
					case X3DConstants .inputOutput:
						callbacks .push ("set_" + field .getName ());
						break;
				}
			}

			text += "\n;var " + callbacks .join (",") + ";";
			text += "\n[" + callbacks .join (",") + "];"

			var
				global  = this .getGlobal (),
				result  = evaluate (global, text),
				context = { };

			for (var i = 0; i < callbacks .length; ++ i)
			{
				if (typeof result [i] === "function")
					context [callbacks [i]] = result [i];
				else
					context [callbacks [i]] = null;
			}

			return context;
		},
		getGlobal: function ()
		{
			var browser = this .getBrowser ();

			function SFNode (vrmlSyntax)
			{
				var scene = browser .createX3DFromString (String (vrmlSyntax));

				if (scene .getRootNodes () .length && scene .getRootNodes () [0])
					return Fields .SFNode .call (this, scene .getRootNodes () [0] .getValue ());

				throw new Error ("SFNode.new: invalid argument, must be 'string' is 'undefined'.");
			}

			SFNode .prototype = Object .create (Fields .SFNode .prototype);
			SFNode .prototype .constructor = SFNode;

			var global =
			{
				NULL:  { value: null },
				FALSE: { value: false },
				TRUE:  { value: true },
				print: { value: function () { this .print .apply (this, arguments); } .bind (browser) },
				trace: { value: function () { this .print .apply (this, arguments); } .bind (browser) },

				Browser: { value: browser },

				X3DConstants:                { value: X3DConstants },
				X3DBrowser:                  { value: X3DBrowser },
				X3DExecutionContext:         { value: X3DExecutionContext },
				X3DScene:                    { value: X3DScene },
				ComponentInfo:               { value: ComponentInfo },
				ComponentInfoArray:          { value: ComponentInfoArray },
				ProfileInfo:                 { value: ProfileInfo },
				ProfileInfoArray:            { value: ProfileInfoArray },
				UnitInfo:                    { value: UnitInfo },
				UnitInfoArray:               { value: UnitInfoArray },
				ExternProtoDeclarationArray: { value: ExternProtoDeclarationArray },
				ProtoDeclarationArray:       { value: ProtoDeclarationArray },
				X3DExternProtoDeclaration:   { value: X3DExternProtoDeclaration },
				X3DProtoDeclaration:         { value: X3DProtoDeclaration },
				RouteArray:                  { value: RouteArray },
				X3DRoute:                    { value: X3DRoute },

				X3DFieldDefinition:   { value: X3DFieldDefinition },
				FieldDefinitionArray: { value: FieldDefinitionArray },

				X3DField:      { value: X3DField },
				X3DArrayField: { value: X3DArrayField },

				SFColor:       { value: Fields .SFColor },
				SFColorRGBA:   { value: Fields .SFColorRGBA },
				SFImage:       { value: Fields .SFImage },
				SFMatrix3d:    { value: Fields .SFMatrix3d },
				SFMatrix3f:    { value: Fields .SFMatrix3f },
				SFMatrix4d:    { value: Fields .SFMatrix4d },
				SFMatrix4f:    { value: Fields .SFMatrix4f },
				SFNode:        { value: SFNode },
				SFRotation:    { value: Fields .SFRotation },
				SFVec3d:       { value: Fields .SFVec2d },
				SFVec2f:       { value: Fields .SFVec2f },
				SFVec2d:       { value: Fields .SFVec3d },
				SFVec3f:       { value: Fields .SFVec3f },
				SFVec4d:       { value: Fields .SFVec4d },
				SFVec4f:       { value: Fields .SFVec4f },
				VrmlMatrix:    { value: Fields .VrmlMatrix },

				MFBool:        { value: Fields .MFBool },
				MFColor:       { value: Fields .MFColor },
				MFColorRGBA:   { value: Fields .MFColorRGBA },
				MFDouble:      { value: Fields .MFDouble },
				MFFloat:       { value: Fields .MFFloat },
				MFImage:       { value: Fields .MFImage },
				MFInt32:       { value: Fields .MFInt32 },
				MFMatrix3d:    { value: Fields .MFMatrix3d },
				MFMatrix3f:    { value: Fields .MFMatrix3f },
				MFMatrix4d:    { value: Fields .MFMatrix4d },
				MFMatrix4f:    { value: Fields .MFMatrix4f },
				MFNode:        { value: Fields .MFNode },
				MFRotation:    { value: Fields .MFRotation },
				MFString:      { value: Fields .MFString },
				MFTime:        { value: Fields .MFTime },
				MFVec2d:       { value: Fields .MFVec2d },
				MFVec2f:       { value: Fields .MFVec2f },
				MFVec3d:       { value: Fields .MFVec3d },
				MFVec3f:       { value: Fields .MFVec3f },
				MFVec4d:       { value: Fields .MFVec4d },
				MFVec4f:       { value: Fields .MFVec4f },
			};

			var userDefinedFields = this .getUserDefinedFields ();

			for (var name in userDefinedFields)
			{
				var field = userDefinedFields [name];

				if (field .getAccessType () === X3DConstants .inputOnly)
					continue;

				if (! (name in global))
				{
					global [name] =
					{
						get: field .valueOf .bind (field),
						set: field .setValue .bind (field),
					};
				}

				if (field .getAccessType () === X3DConstants .inputOutput)
				{
					global [name + "_changed"] =
					{
						get: field .valueOf .bind (field),
						set: field .setValue .bind (field),
					};
				}
			}

			return Object .create (Object .prototype, global);
		},
		set_live__: function ()
		{
			var userDefinedFields = this .getUserDefinedFields ();

			if (this .getExecutionContext () .isLive ().getValue () && this .isLive () .getValue ())
			{
				if ($.isFunction (this .context .prepareEvents))
					this .getBrowser () .prepareEvents () .addInterest (this, "prepareEvents__");

				if ($.isFunction (this .context .eventsProcessed))
					this .addInterest (this, "eventsProcessed__");

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];
					
					switch (field .getAccessType ())
					{
						case X3DConstants .inputOnly:
						{
							var callback = this .context [field .getName ()];

							if ($.isFunction (callback))
								field .addInterest (this, "set_field__", callback);

							break;
						}
						case X3DConstants .inputOutput:
						{
							var callback = this .context ["set_" + field .getName ()];

							if ($.isFunction (callback))
								field .addInterest (this, "set_field__", callback);

							break;
						}
					}
				}
			}
			else
			{
				if (this .context .prepareEvents)
					this .getBrowser () .prepareEvents () .removeInterest (this, "prepareEvents__");

				if (this .context .eventsProcessed)
					this .removeInterest (this, "eventsProcessed__");

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];

					switch (field .getAccessType ())
					{
						case X3DConstants .inputOnly:
						case X3DConstants .inputOutput:
							field .removeInterest (this, "set_field__");
							break;
					}
				}
			}
		},
		initialize__: function (text)
		{
			this .context = this .getContext (text);

			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			this .set_live__ ();

			if (this .context .initialize)
			{
				var browser = this .getBrowser ();

				browser .getScriptStack () .push (this);

				try
				{
					this .context .initialize ();
				}
				catch (error)
				{
					this .setError ("initialize", error);
				}

				browser .getScriptStack () .pop ();
			}
		},
		prepareEvents__: function ()
		{
			var browser = this .getBrowser ();

			browser .getScriptStack () .push (this);

			try
			{
				this .context .prepareEvents ();
			}
			catch (error)
			{
				this .setError ("prepareEvents", error);
			}

			browser .getScriptStack () .pop ();
		},
		set_field__: function (field, callback)
		{
			var browser = this .getBrowser ();

			field .setTainted (true);
			browser .getScriptStack () .push (this);

			try
			{
				callback (field .valueOf (), browser .getCurrentTime ());
			}
			catch (error)
			{
				this .setError (field .getName (), error);
			}

			browser .getScriptStack () .pop ();
			field .setTainted (false);
		},
		eventsProcessed__: function ()
		{
			var browser = this .getBrowser ();

			browser .getScriptStack () .push (this);

			try
			{
				this .context .eventsProcessed ();
			}
			catch (error)
			{
				this .setError ("eventsProcessed", error);
			}

			browser .getScriptStack () .pop ();
		},
		shutdown__: function ()
		{
			var browser = this .getBrowser ();

			browser .getScriptStack () .push (this);

			try
			{
				this .context .shutdown ();
			}
			catch (error)
			{
				this .setError ("shutdown", error);
			}

			browser .getScriptStack () .pop ();
		},
		setError: function (callback, error)
		{
			console .error ("JavaScript Error in Script '" + this .getName () + "', function '" + callback + "'\nworld url is '" + this .getExecutionContext () .getURL () + "':");
			console .error (error);
		},
	});

	return Script;
});

