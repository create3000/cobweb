
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Scripting/X3DScriptNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DScriptNode, 
          X3DConstants)
{
	with (Fields)
	{
		var
			ECMAScript = /^\s*(?:vrmlscript|javascript|ecmascript)\:((?:.|[\r\n])*)$/,
			fieldDefinitions = [
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",          new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "directOutput", new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "mustEvaluate", new SFBool (false)),
			];
	
		function Script (executionContext)
		{
			this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

			X3DScriptNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Script);
		}

		Script .prototype = $.extend (new X3DScriptNode (),
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

				this .requestImmediateLoad ();
			},
			hasUserDefinedFields: function ()
			{
				return true;
			},
			getCDATA: function ()
			{
				return this .url_;
			},
			requestImmediateLoad: function ()
			{
				for (var i = 0, length = this .url_ .length; i < length; ++ i)
				{
					var
						URL    = this .url_ [i],
						result = ECMAScript .exec (URL);

					try
					{
						if (result)
						{
							this .setText (result [1]);
							break;
						}
					}
					catch (error)
					{
						console .error (error .message);
					}
				}
			},
			setText: function (text)
			{
				this .context = this .getContext (text);

				this .set_live__ ();

				try
				{
					if (this .context .initialize)
						this .context .initialize ();
				}
				catch (error)
				{
					console .error (error .message);
				}
			},
			getContext: function (text)
			{
				var
					handler           = ["initialize", "prepareEvents", "eventsProcessed", "shutdown"]
					userDefinedFields = this .getUserDefinedFields ();

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];

					switch (field .getAccessType ())
					{
						case X3DConstants .inputOnly:
							handler .push (field .getName ());
							break;
						case X3DConstants .inputOutput:
							handler .push ("set_" + field .getName ());
							break;
					}
				}

				text += "\n;var " + handler .join (",") + ";";
				text += "\n[" + handler .join (",") + "];"

				var
					global  = Object .create ({ }, this .getGlobal ()),
					result  = evaluate (global, text),
					context = { };

				for (var i = 0; i < handler .length; ++ i)
				{
					if (typeof result [i] === "function")
						context [handler [i]] = result [i];
					else
						context [handler [i]] = null;
				}

				return context;
			},
			getGlobal: function ()
			{
				var global =
				{
					NULL: { value: null },
					FALSE: { value: false },
					TRUE: { value: true },
					print: { value: function () { this .print .apply (this, arguments); } .bind (this .getBrowser ()) },
					X3DConstants: { value: X3DConstants },
					Browser: { value: this .getBrowser () },
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

				return global;
			},
			set_live__: function ()
			{
				var userDefinedFields = this .getUserDefinedFields ();

				if (this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ())
				{
					for (var name in userDefinedFields)
					{
						var field = userDefinedFields [name];
						
						switch (field .getAccessType ())
						{
							case X3DConstants .inputOnly:
							{
								if (this .context [field .getName ()])
									field .addInterest (this, "set_field__", field .getName ());
								break;
							}
							case X3DConstants .inputOutput:
							{
								var handler = "set_" + field .getName ();
	
								if (this .context [handler])
									field .addInterest (this, "set_field__", handler);
								break;
							}
						}
					}
				}
				else
				{
					for (var name in userDefinedFields)
					{
						var field = userDefinedFields [name];
						
						switch (field .getAccessType ())
						{
							case X3DConstants .inputOnly:
							{
								field .removeInterest (this, "set_field__");
								break;
							}
							case X3DConstants .inputOutput:
							{
								field .removeInterest (this, "set_field__");
								break;
							}
						}
					}
				}
			},
			set_field__: function (field, handler)
			{
				field .setTainted (true);

				try
				{
					this .context [handler] (field .valueOf (), this .getBrowser () .getCurrentTime ());
				}
				catch (error)
				{
					console .log (error .message);
				}

				field .setTainted (false);
			},
		});

		function evaluate (__global__, __text__)
		{
			with (__global__)
			{
				function print () { Browser .print .apply (Browser, arguments); }

				return eval (__text__);
			}		
		}

		return Script;
	}
});

