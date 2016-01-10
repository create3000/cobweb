
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
"use strict";

	function X3DExternProtoDeclaration (executionContext)
	{
		X3DProtoDeclarationNode .call (this, executionContext);
		X3DUrlObject            .call (this, executionContext);

		this .addType (X3DConstants .X3DExternProtoDeclaration);

		this .addChildren ("url", new Fields .MFString ());

		this .deferred = $.Deferred ();
	}

	X3DExternProtoDeclaration .prototype = $.extend (Object .create (X3DProtoDeclarationNode .prototype),
		X3DUrlObject .prototype,
	{
		constructor: X3DExternProtoDeclaration,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
		]),
		getTypeName: function ()
		{
			return "EXTERNPROTO";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "externprotos";
		},
		initialize: function ()
		{
			X3DProtoDeclarationNode .prototype .initialize .call (this);
			X3DUrlObject            .prototype .initialize .call (this);
				
			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");
		},
		set_live__: function ()
		{
			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE)
			{
				var value = this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ();
				
				if (value)
					this .scene .beginUpdate ();
				else
					this .scene .endUpdate ();
			}
		},
		isExternProto: function ()
		{
			return true;
		},
		setProtoDeclaration: function (value)
		{
			this .proto = value;
		},
		getProtoDeclaration: function ()
		{
			return this .proto;
		},
		requestAsyncLoad: function (callback)
		{
			this .deferred .done (callback);

			if (this .checkLoadState () === X3DConstants .COMPLETE_STATE || this .checkLoadState () === X3DConstants .IN_PROGRESS_STATE)
				return;

			this .setLoadState (X3DConstants .IN_PROGRESS_STATE);
			this .getScene () .addLoadCount (this);
			
			// Don't create scene cache, as of possible default nodes and complete scenes.

			var Loader = require ("cobweb/InputOutput/Loader");

			new Loader (this) .createX3DFromURL (this .url_, this .setSceneAsync .bind (this));
		},
		setSceneAsync: function (value)
		{
			this .getScene () .removeLoadCount (this);
		
			if (value)
				this .setScene (value);

			else
				this .setError ();
		},
		setError: function (error)
		{
			console .log (error);

			this .setLoadState (X3DConstants .FAILED_STATE);

			this .scene = this .getBrowser () .getPrivateScene ();

			this .setProtoDeclaration (null);

			this .deferred .resolve ();
			this .deferred = $.Deferred ();
		},
		setScene: function (value)
		{
			this .scene = value;

			this .setLoadState (X3DConstants .COMPLETE_STATE);

			this .scene .isLive_ = this .getExecutionContext () .isLive_ .getValue () && this .isLive_ .getValue ();
			//this .scene .setExecutionContext (this .getExecutionContext ());

			this .scene .setup ();

			var protoName = this .scene .getURL () .fragment || 0;

			this .setProtoDeclaration (this .scene .protos [protoName]);

			this .deferred .resolve ();
		},
	});

	return X3DExternProtoDeclaration;
});

