
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Prototype/X3DProtoDeclarationNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DUrlObject,
          X3DProtoDeclarationNode, 
          X3DConstants)
{
	with (Fields)
	{
		var fieldDefinitions = [
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new SFNode ()),
		];

		function X3DExternProtoDeclaration (executionContext)
		{
			this .fieldDefinitions = new FieldDefinitionArray (fieldDefinitions .slice (0));

			X3DProtoDeclarationNode .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject            .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .X3DExternProtoDeclaration);

			this .callbacks = [ ];
		}

		X3DExternProtoDeclaration .prototype = $.extend (Object .create (X3DProtoDeclarationNode .prototype),
			X3DUrlObject .prototype,
		{
			constructor: X3DExternProtoDeclaration,
			getTypeName: function ()
			{
				return "EXTERNPROTO";
			},
			/*
			getComponentName: function ()
			{
				return "Cobweb";
			},
			getContainerField: function ()
			{
				return "externprotos";
			},
			*/
			initialize: function ()
			{
				X3DProtoDeclarationNode .prototype .initialize .call (this);
				X3DUrlObject            .prototype .initialize .call (this);
			},
			isExternProto: function ()
			{
				return true;
			},
			requestAsyncLoad: function (callback)
			{
				if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .FAILED_STATE)
				{
					callback (this .getProto ());
					return;
				}

				this .callbacks .push (callback);

				if (! this .inlineNode)
				{
					var Inline = require ("cobweb/Components/Networking/Inline");

					this .inlineNode       = new Inline (this .getExecutionContext ());
					this .inlineNode .url_ = this .url_;
					this .inlineNode .loadState_ .addInterest (this, "set_loadState__");
					this .inlineNode .setup ();
					
					this .getExecutionContext () .getScene () .addLoadCount ();
				}
			},
			set_loadState__ (field)
			{
				var loadState = field .getValue ();

				switch (loadState)
				{
					case X3DConstants .NOT_STARTED_STATE:
					case X3DConstants .IN_PROGRESS_STATE:
						this .setLoadState (loadState);
						break;
					case X3DConstants .COMPLETE_STATE:
					case X3DConstants .FAILED_STATE:
					{
						this .setLoadState (loadState);
						this .getExecutionContext () .getScene () .removeLoadCount ();

						var proto = this .getProto ();

						for (var i = 0; i < this .callbacks .length; ++ i)
							this .callbacks [i] (proto);

						this .callbacks .length = 0;
						break;
					}
				}
			},
			getProto: function ()
			{
				var
					name  = this .inlineNode .getScene () .getWorldURL () .fragment || this .getName (),
					proto = this .inlineNode .getScene () .protos [name];

				return proto;
			},
		});

		return X3DExternProtoDeclaration;
	}
});

